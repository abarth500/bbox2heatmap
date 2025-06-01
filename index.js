/**
 * Created by Shohei Yokoyama on 2015/10/15.
 */
//const format = require('string-template');
const { TemplateEngine } = require('thymeleaf');
const templateEngine = new TemplateEngine();

const async = require('async');
const fs = require('fs');
const path = require('path');
function BBOX2Heatmap(apikey, bbox, option) {
    console.log("[Start Crawling]");
    console.log(bbox);
    console.log(option);
    var maxUploadDate = Math.floor(Date.now() / 1000);
    /*
    var north = Math.max(bbox[0],bbox[2]);
    var south = Math.min(bbox[0],bbox[2]);
    var east  = Math.max(bbox[1],bbox[3]);
    var west  = Math.min(bbox[1],bbox[3]);
    */
    var doneCrawl = false;
    var search = false;
    var track = false;
    var local = false;
    var max = 1000000;
    var shortid = require('shortid');
    var output = __dirname + path.sep + 'output' + path.sep + shortid.generate() + '.json';
    var html = '';
    if (option) {
        if (option.hasOwnProperty('track')) {
            track = option.track.split(',');
        }
        if (option.hasOwnProperty('search')) {
            search = option.search;
        }
        if (option.hasOwnProperty('max')) {
            max = option.max;
        }
        if (option.hasOwnProperty('output')) {
            if (option.hasOwnProperty('directory')) {
                local = true;
                fs.mkdirSync(option.directory);
                output = option.directory + 'result.json';
                html = option.directory + 'index.html';
            } else {
                output = __dirname + 'output' + option.output + '.json';
            }
        }
    }
    /*
    try{
        var opt = require(__dirname + "/value.json");
    } catch(err){
        if(err.code === 'MODULE_NOT_FOUND'){
            try {
                opt = require(__dirname + "/../../value.json");
            }catch(err2) {
                if(err2.code === 'MODULE_NOT_FOUND') {
                    console.log("Set your Flickr API key to ./values.json (See also value-original.json)");
                    process.exit();
                }
            }
        }
    }
    */
    //var flickr_options  = opt['flickr_options'];
    console.log('Output:', output);
    async.waterfall([openOutputFile, openFlickrConnection, doCrawl], errorHandler);

    function openOutputFile(next) {
        var line = '{"bbox":[' + bbox.join(',') + '],';
        fs.open(output, 'w', '0666', function (err, fd) {
            if (search) {
                line += '"search":"' + search + '",';
            }
            if (track) {
                line += '"track":["' + track.join('","') + '"],';
            }
            fs.writeSync(fd, line + '"data":[' + '\n');
            next(err, fd);
        });
    }

    function openFlickrConnection(fd, next) {
        var Flickr = require('flickr-sdk');
        var flickr = new Flickr(apikey);
        next(null, fd, flickr);
        /*
        var Flickr = require("flickrapi");
        Flickr.tokenOnly(flickr_options, function (errFlickr, flickr) {
            if (errFlickr) {
                next(errFlickr);
            }else{
                next(null,fd,flickr);
            }
        });
        */
    }
    function doCrawl(fd, flickr, next) {
        console.log('写真をFlickrから取得します。全て集め終えるか、' + max + '件取得で自動終了する他、[Ctrl+C]で途中終了も可能です。終了後はヒートマップを表示する事ができます。');
        var ids = {};
        var nop = 0;
        var page = 1;
        const handlerSIGINT = () => { next(new Error('SIGINT'), fd, flickr); };
        process.on('SIGINT', handlerSIGINT);
        async.forever(
            function (nextF) {
                var maxUploadDate_start = maxUploadDate;
                var opt = {
                    page: page,
                    per_page: 250,
                    bbox: bbox.join(','),
                    sort: 'date-posted-desc',
                    max_upload_date: maxUploadDate,
                    extras: 'date_upload,date_taken,url_sq,url_z,geo',
                };
                if (option.searchmode == "fulltext") {
                    if (search) {
                        opt.text = search;
                    }
                } else {
                    if (search) {
                        opt.tags = search;
                    }
                    if (option.searchmode == "and") {
                        opt.tag_mode = "all"
                    }
                }
                flickr.photos
                    .search(opt)
                    .then(
                        function (response) {
                            let result = JSON.parse(response.text);
                            if (doneCrawl) {
                            } else {
                                try {
                                    result.photos.photo.forEach(function (photo) {
                                        if (typeof ids[photo.id] != 'undefined') {
                                            return true;
                                        }
                                        ids[photo.id] = true;
                                        nop++;
                                        //console.log(photo);
                                        var t = photo.datetaken.split(/[- :]/);
                                        var datetaken = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
                                        var line = {
                                            id: photo.id,
                                            owner: photo.owner,
                                            dateupload: +photo.dateupload,
                                            datetaken: Math.floor(datetaken.getTime() / 1000),
                                            latitude: +photo.latitude,
                                            longitude: +photo.longitude,
                                            url_sq: photo.url_sq,
                                            url_z: photo.url_z,
                                        };
                                        if (!doneCrawl) {
                                            require('fs').writeSync(fd, JSON.stringify(line) + ',\n', '');
                                        }
                                        maxUploadDate = 1 * photo.dateupload;
                                        if (nop >= max) {
                                            console.log('[' + maxUploadDate + ' (' + page + '/' + result.photos.pages + ')] ' + nop + ' photographs');
                                            //errorHandler(null, fd);
                                            doneCrawl = true;
                                            throw new Error('Done');
                                            //nextF('Collect ' + max + ' photos', fd, flickr);
                                            //return 'Collect ' + max + ' photos';
                                            //process.exit(0);
                                        }
                                    });
                                    //maxUploadDate--;
                                    if (result.photos.pages == 1) {
                                        doneCrawl = true;
                                        throw new Error('Done');
                                        //nextF('Collect all photos', fd, flickr);
                                        //return 'collect all photos';
                                        //process.exit(0);
                                    }
                                    if (doneCrawl) {
                                        throw new Error('Done');
                                    } else {
                                        if (maxUploadDate_start == maxUploadDate) {
                                            page++;
                                        } else {
                                            page = 1;
                                        }
                                        console.log('[' + maxUploadDate + ' (' + page + ')] ' + nop + ' photographs');
                                        nextF(null, fd, flickr);
                                    }
                                } catch (e) {
                                    nextF('Done', fd, flickr);
                                }
                            }
                        },
                        () => {
                            console.log('Rejected');
                            //next(fd, flickr);
                        }
                    )
                    .catch(function (err) {
                        console.error('bonk', err);
                    });
            },
            (err) => {
                console.log(err);
                next('Done', fd, flickr);
            }
        );
    }
    function errorHandler(err, fd) {
        process.removeAllListeners('SIGINT');
        process.on('SIGINT', function () {
            console.log("プログラムを終了します。");
            process.exit(0);
        });
        console.log('[Stop by user ' + err.message + ']\n\tResult is stored into ' + output);
        doneCrawl = true;
        var fs = require('fs');
        fs.write(fd, '{}]}', function () {
            fs.close(fd);
            //console.error(err);
            if (local) {
                //HTMLファイル(テンプレート)読み込み
                const template_path = __dirname + path.sep + 'output' + path.sep + 'index.html';
                let template = fs.readFileSync(template_path);
                //console.log(template.toString());
                //JSONファイル読み込み
                let json = fs.readFileSync(output);

                const pattern1 = /\/\*bbox2heatmap0result\*\//; template = template.toString().replace(pattern1, json.toString() + "; //");
                const pattern2 = /\/\*bbox2heatmap0bbox\*\//; template = template.replace(pattern2, '[' + bbox[0] + ',' + bbox[1] + ',' + bbox[2] + ',' + bbox[3] + ']; //');
                const pattern3 = /\/\*bbox2heatmap0search\*\//; template = template.replace(pattern3, "'" + option.search + "'; //");
                //JSONファイル消去
                fs.writeFileSync(html, template);
                fs.rmSync(output);
                console.log('\tOpen ' + html + ' to see the results');


            } else {
                const port = 54328;
                const opener = require('opener');
                const http = require('http');
                const server = http.createServer((request, response) => {
                    if (request.url == '/json') {
                        response.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8',
                        });
                        var raw = fs.createReadStream(output);
                        raw.pipe(response);
                    } else {
                        response.writeHead(200, {
                            'Content-Type': 'text/html',
                        });
                        var raw = fs.createReadStream(__dirname + '/output/index.html');
                        raw.pipe(response);
                    }
                });
                server.listen(port);
                const URL = 'http://localhost:' + port + '/?bbox=' + bbox[0] + ',' + bbox[1] + ',' + bbox[2] + ',' + bbox[3] + '&search=' + option.search;
                opener(URL);
                console.log('\tServer running at http://localhost:' + port + '/');
                console.log('ブラウザが自動で開かない場合は以下のURLに接続してください。');
                console.log("\t" + URL);
                console.log('プログラムを停止するには[Ctrl+C]もしくは[Command+.]を押してください。');
            }
        });
    }
}
module.exports = BBOX2Heatmap;
