#!/usr/bin/env node

/**
 * Created by Shohei Yokoyama on 2015/10/15.
 */

var BBOX2Heatmap = require(__dirname + '/index.js');
var argv = require('yargs')
    .usage('Usage: node $0 <output-file-name> [options]')
    .example('$0 mickey-in-disney-world --bbox=-81.603699,28.345482,-81.505508,28.426581 --search=mickey', 'Draw heatmap of photographs of Mickey in Disney World')
    .demand(['B'])
    .alias('B', 'bbox')
    .describe('B', 'comma-separated bbox')
    .string('B')
    .alias('S', 'search')
    .describe('S', 'search keyword (e.g. dog)')
    .alias('T', 'track')
    .describe('T', 'draw markers of Flickr users (Comma separated user IDs, e.g. 40287908@N02')
    .string('S')
    .alias('M', 'max')
    .describe('M', 'maximum number of photographs (e.g. 10000)')
    .string('M')
    .alias('K', 'apikey')
    .describe('K', 'Your API KEY for flickr API')
    .string('K')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2022').argv;
if (!argv.bbox) {
    console.error('Set BBOX. (see --help)');
    process.exit();
} else {
    var bbox = argv.bbox.split(',');
    if (bbox.length == 4 && !isNaN(bbox[0]) && !isNaN(bbox[1]) && !isNaN(bbox[2]) && !isNaN(bbox[3])) {
        var option = {};
        if (argv._.length > 0) {
            option.output = argv._[0];
        }
        if (argv.search) {
            option.search = argv.search;
        }
        if (argv.max) {
            option.max = argv.max;
        }
        if (argv.track) {
            option.track = argv.track;
        }
        const crypto = require('crypto');
        const prompts = require('prompts');
        (async function () {
            try {
                const apikey = await (async () => {
                    if (argv.apikey) {
                        return argv.apikey;
                    } else {
                        let questions = {
                            type: 'text', // インプットタイプ
                            name: 'myValue', // 変数名
                            message: 'パスワードを入力してください',
                        };
                        let response = await prompts(questions);
                        const password = response.myValue;
                        const algorithm = 'aes-128-ecb'; //ecbモードは前のブロックを使わない単純な暗号利用モードらしい。なのでivが不要
                        const password_md5 = crypto.createHash('md5').update(password, 'utf8').digest();
                        const apikey_encrypted = '2e5c44bdfc8400419a47ceeacbd19a7bfd68e8cc97bcdbfd65a91a3b4b8dc662e6916a2ab5456b33963a987baad6171c';
                        const decipher = crypto.createDecipheriv(algorithm, password_md5, null);
                        return decipher.update(apikey_encrypted, 'hex', 'utf-8') + decipher.final('utf-8');
                    }
                })();
                if (Object.keys(option).length > 0) {
                    console.log('[Start] bbox:' + bbox.slice(0, 4).join(',') + ' option=' + JSON.stringify(option));
                    BBOX2Heatmap(apikey, bbox.slice(0, 4), option);
                } else {
                    console.log('[Start] bbox:' + bbox.slice(0, 4).join(','));
                    BBOX2Heatmap(apikey, bbox.slice(0, 4));
                }
            } catch (e) {
                console.log('パスワードが間違っています。kibacoで配布されたパスワードをそのまま記入してください。');
                process.exit(1);
            }
        })();
    } else {
        console.error('Invalid BBOX. (see --help)');
        process.exit();
    }
}
