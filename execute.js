/**
 * Created by Shohei Yokoyama on 2015/10/15.
 */
var argv = require('argv');
var BBOX2Heatmap = require(__dirname + "/index.js");
argv.option([
    {
        name: 'bbox',
        short: 'B',
        type: 'csv,float',
        description: 'set Bounding BOX e.g.',
        example: "'node bbox2heatmap/execute.js -B 11.543283,48.12657,11.554785,48.137053'"
    }
]);
var args = argv.run();
if (!args.options.bbox) {
    console.error("Set BBOX. (see --help)");
    process.exit();
} else {
    if (args.options.bbox.length == 4
        && !isNaN(args.options.bbox[0])
        && !isNaN(args.options.bbox[1])
        && !isNaN(args.options.bbox[2])
        && !isNaN(args.options.bbox[3])) {
        BBOX2Heatmap(args.options.bbox.slice(0, 4));
    } else {
        console.error("Invalid BBOX. (see --help)");
        process.exit();
    }
}