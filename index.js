/**
 * Created by Shohei Yokoyama on 2015/10/15.
 */

function BBOX2Heatmap(bbox,option){
    var maxUploadDate = Math.floor(Date.now() / 1000);
    /*
    var north = Math.max(bbox[0],bbox[2]);
    var south = Math.min(bbox[0],bbox[2]);
    var east  = Math.max(bbox[1],bbox[3]);
    var west  = Math.min(bbox[1],bbox[3]);
    */
    var search = false;
    var track = false;
    var max = 1000000;
    var shortid = require('shortid');
    var output = __dirname + "/output/" + shortid.generate() + ".json";
    if(option) {
        if (option.hasOwnProperty("track")) {
            track = option.track.split(",");
        }
        if (option.hasOwnProperty("search")) {
            search = option.search;
        }
        if (option.hasOwnProperty("max")) {
            max = option.max;
        }
        if (option.hasOwnProperty("output")){
            output = __dirname + "/output/" + option.output + ".json";
        }
    }
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
    var flickr_options  = opt['flickr_options'];
    var async = require('async');
    async.waterfall([
        openOutputFile,
        openFlickrConnection,
        doCrawl
    ],errorHandler);

    function openOutputFile(next){
        var fs = require('fs');
        var line = '{"bbox":['+bbox.join(',')+'],';
        fs.open(output, "w",'0666',function(err,fd){
            if(search){
                line+= '"search":"'+search+'",';
            }
            if(track){
                line+= '"track":["'+track.join('","')+'"],';
            }
            fs.writeSync(fd,line+'"data":['+"\n");
            next(err,fd);
        });
    }

    function openFlickrConnection(fd,next){
        var Flickr = require("flickrapi");
        Flickr.tokenOnly(flickr_options, function (errFlickr, flickr) {
            if (errFlickr) {
                next(errFlickr);
            }else{
                next(null,fd,flickr);
            }
        });
    }
    function doCrawl(fd,flickr,next){
        console.log("Ready!");
        var ids = {};
        var nop = 0;
        var page = 1;
        process.on('SIGINT', function() {
            next(new Error('SIGINT'),fd,flickr);
        });
        async.forever(function(next){
            var maxUploadDate_start = maxUploadDate;
            var opt = {
                page:page,
                per_page:250,
                bbox:bbox.join(","),
                sort:"date-posted-desc",
                max_upload_date :maxUploadDate,
                extras:"date_upload,date_taken,url_sq,url_z,geo"
            };
            if(search){
                opt.text = search;
            }
            flickr.photos.search(
                opt,
                function (err, result) {
                    result.photos.photo.forEach(function(photo) {
                        if(typeof ids[photo.id] != "undefined"){
                            return true;
                        }
                        ids[photo.id] = true;
                        nop++;
                        //console.log(photo);
                        var t = photo.datetaken.split(/[- :]/);
                        var datetaken = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                        var line = {
                            "id":photo.id,
                            "owner":photo.owner,
                            "dateupload":+photo.dateupload,
                            "datetaken":Math.floor(datetaken.getTime() / 1000),
                            "latitude":+photo.latitude,
                            "longitude":+photo.longitude,
                            "url_sq":photo.url_sq,
                            "url_z":photo.url_z
                        };
                        require('fs').write(fd,JSON.stringify(line)+",\n");
                        maxUploadDate = 1 * photo.dateupload;
                        if(nop >= max){
                            console.log("["+maxUploadDate+" ("+page+")] "+ nop +" photographs");
                            errorHandler(null,fd);
                            process.exit(0);
                        }
                    });
                    //maxUploadDate--;
                    if(result.photos.pages == 1){
                        errorHandler(null,fd);
                        process.exit(0);
                    }
                    if(maxUploadDate_start == maxUploadDate){
                        page++;
                    }else{
                        page = 1;
                    }
                    console.log("["+maxUploadDate+" ("+page+")] "+ nop +" photographs");
                    next(null,fd,flickr);
                }
            );
        });
    }
    function errorHandler(err,fd){
        console.log('[Stop by user '+err+']\n\tResult is stored into '+output);
        var fs = require('fs');
        fs.write(fd,"{}]}",function(){
            fs.close(fd);
            console.error(err);
            process.exit();
        });
    }
}
module.exports = BBOX2Heatmap;