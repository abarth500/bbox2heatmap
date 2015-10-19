/**
 * Created by Shohei Yokoyama on 2015/10/15.
 */

var BBOX2Heatmap = require(__dirname + "/index.js");
var argv = require('yargs')
    .usage('Usage: node $0 <output-file-name> [options]')
    .example('$0 mickey-in-disney-world --bbox=-81.603699,28.345482,-81.505508,28.426581 --search=mickey', 'Draw heatmap of photographs of Mickey in Disney World')
    .demand(['B'])
    .alias('B', 'bbox')
    .describe('B', 'comma-separated bbox')
    .string('B')
    .alias('S', 'search')
    .describe('S', 'search keyword e.g. dog')
    .string('S')
    .alias('M', 'max')
    .describe('M', 'maximum number of photographs e.g. 10000')
    .string('M')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2015')
    .argv;
if (!argv.bbox) {
    console.error("Set BBOX. (see --help)");
    process.exit();
} else {
    var bbox =argv.bbox.split(',');
    if (bbox.length == 4
        && !isNaN(bbox[0])
        && !isNaN(bbox[1])
        && !isNaN(bbox[2])
        && !isNaN(bbox[3])) {
        var option = {};
        if(argv._.length>0) {
            option.output = argv._[0];
        }
        if(argv.search) {
            option.search = argv.search;
        }
        if(argv.max){
            option.max = argv.max;
        }
        if(Object.keys(option).length > 0){
            console.log("[Start] bbox:"+bbox.slice(0, 4).join(",") + " option="+JSON.stringify(option));
            BBOX2Heatmap(bbox.slice(0, 4),option);
        }else {
            BBOX2Heatmap(bbox.slice(0, 4));
        }
    } else {
        console.error("Invalid BBOX. (see --help)");
        process.exit();
    }
}