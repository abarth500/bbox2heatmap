#!/usr/bin/env node

/**
 * Created by Shohei Yokoyama on 2015/10/15.
 */

const shortid = require('shortid');
const crypto = require('crypto');
const prompts = require('prompts');
const path = require('path');
var BBOX2Heatmap = require(__dirname + '/index.js');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv))
argv.usage('Usage: node $0 [output-file-name] [options]')
    .example('$0 mickey-in-disney-world --bbox=-81.603699,28.345482,-81.505508,28.426581 --search=mickey')
    //.demand(['B'])
    .alias('B', 'bbox')
    .describe('B', 'comma-separated bbox (see https://boundingbox.klokantech.com/ )')
    .string('B')
    .alias('S', 'search')
    .describe('S', 'search tags (Comma separated tags, e.g. dog,doggy)')
    .string('S')
    .alias('s', 'searchmode')
    .describe('s', 'choose search mode')
    .choices('s', ['or', 'and', 'fulltext'])
    .default('s', "or")
    .alias('T', 'track')
    .describe('T', 'draw markers of Flickr users (Comma separated user IDs, e.g. 40287908@N02')
    .string('T')
    .alias('M', 'max')
    .describe('M', 'maximum number of photographs (e.g. 10000)')
    .number('M')
    .default('M', 20000)
    .alias('K', 'apikey')
    .describe('K', 'Your API KEY for flickr API')
    .string('K')
    .alias('P', 'portable')
    .describe('P', 'ignore on-demand visualization and save result as a static JSON file')
    .boolean('P')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2022-2025').argv;

var option = {};
if (argv.argv._.length > 0 && !argv.argv._[0].startsWith('-')) {
    option.output = argv.argv._[0];
} else {
    option.output = "_" + shortid.generate();
}

if (argv.argv.max) {
    option.max = argv.argv.max;
} else {
    option.max = 20000;
}
if (argv.argv.track) {
    option.track = argv.argv.track;
}

if (argv.argv.hasOwnProperty('portable')) {
    option.directory = process.cwd() + path.sep + option.output + path.sep;
    console.log('Outpur Dir:', option.directory);
}

(async function () {
    try {
        const apikey = await (async () => {
            if (argv.argv.apikey) {
                return argv.argv.apikey;
            } else {
                try {
                    let questions = {
                        type: 'text', // インプットタイプ
                        name: 'myValue', // 変数名
                        message: 'パスワードを入力してください',
                    };
                    let response = await prompts(questions);
                    const password = response.myValue;
                    const algorithm = 'aes-128-ecb'; //ecbモードは前のブロックを使わない単純な暗号利用モードらしい。なのでivが不要
                    const password_md5 = crypto.createHash('md5').update(password, 'utf8').digest();
                    const apikey_encrypted = '042239e912ee61f10ece2f4a171abdc8b38e7aca3cf1b3c36f006e92356935634b7a4bfff0cffdab6caf6977eca7da27';
                    const decipher = crypto.createDecipheriv(algorithm, password_md5, null);
                    return decipher.update(apikey_encrypted, 'hex', 'utf-8') + decipher.final('utf-8');
                } catch (e) {
                    throw new Error('パスワードが間違っています。kibacoで配布されたパスワードをそのまま記入してください。');
                }
            }
        })();
        const bbox = await (async () => {
            if (argv.argv.bbox) {
                return argv.argv.bbox.split(',');
            } else {
                console.log('');
                console.log('BBOX作成サイト：', 'https://boundingbox.klokantech.com/');
                console.log('上記サイトの使い方：', 'https://github.com/abarth500/bbox2heatmap/blob/HEAD/bbox.png');
                let questions = {
                    type: 'text', // インプットタイプ
                    name: 'myBBOX', // 変数名
                    message: '検索範囲(BBOX)をカンマ区切り入力してください。そのままEnterで全世界が検索対象になります。',
                };
                let response = await prompts(questions);
                if (response.myBBOX == "") {
                    response = { myBBOX: "-90,-180,90,180" };
                    console.log("->全世界が対象になりました。");
                }
                return response.myBBOX.split(',');
            }
        })();
        if (bbox.length != 4 || isNaN(bbox[0]) || isNaN(bbox[1]) || isNaN(bbox[2]) || isNaN(bbox[3])) {
            throw new Error('BBOXの形式が異なります。以下のスクリーンショットを参考に入力してください。\nhttps://github.com/abarth500/bbox2heatmap/blob/HEAD/bbox.png');
        }
        const search = await (async () => {
            if (argv.argv.search) {
                return argv.argv.search;
            } else {
                let questions = {
                    type: 'text', // インプットタイプ
                    name: 'mySearch', // 変数名
                    message: '検索タグを入力してください。全ての写真を集める場合はそのままEnterを押してください。',
                };
                let response = await prompts(questions);
                return response.mySearch;
            }
        })();
        if (search != '') {
            option.search = search;
        } else {
            if (bbox[0] == -90 && bbox[1] == -180 && bbox[2] == 90 && bbox[3] == 180) { 
                throw new Error("全世界を対象とする場合キーワード無し検索は出来ません。");
            }
        }
        if (argv.argv.searchmode) {
            option.searchmode = argv.argv.searchmode;
        }
        if (Object.keys(option).length > 0) {
            //console.log('[Start] bbox:' + bbox.slice(0, 4).join(',') + ' option=' + JSON.stringify(option));
            BBOX2Heatmap(apikey, bbox.slice(0, 4), option);
        } else {
            //console.log('[Start] bbox:' + bbox.slice(0, 4).join(','));
            BBOX2Heatmap(apikey, bbox.slice(0, 4));
        }
    } catch (e) {
        console.log(e + '\n');
        process.exit(1);
    }
})();
/*} else {
    console.error('Invalid BBOX. (see --help)');
    process.exit();
}*/
/*}*/
