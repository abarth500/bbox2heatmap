# bbox2heatmap

## Install

```(sh)
npm install bbox2heatmap
```

Set your Flickr API key and secret into value.js (The themplate is value-original.js)

```(JavaScript)
{
  "flickr_options": {
    "api_key": "01234567890123456789012345678901",
    "secret": "1234567890123456"
  }
}
```


## Execute (Crawling)

Who drinks the most beer, wine, and whisky in Europe?

### Crawling Flickr Whisky Photographs
```(sh)
node bbox2heatmap/execute.js --bbox=-19.69,36.03,26.37,59.18 --serch=whisky --max=10000
```

### Crawling Flickr Wine Photographs
```(sh)
node bbox2heatmap/execute.js --bbox=-19.69,36.03,26.37,59.18 --serch=wine --max=10000
```

### Crawling Flickr Beer Photographs
```(sh)
node bbox2heatmap/execute.js --bbox=-19.69,36.03,26.37,59.18 --serch=wine --max=10000
```

## Visualize
1. Open "bbox2heatmap/output/index.html"
2. Open result JSON file.

### Heatmap of Wine in Europe
![Wine heatmap](https://c1.staticflickr.com/1/630/21677292443_ef99646bf3_z.jpg "Wine in Europe")

### Heatmap of Beer in Europe
![Beer heatmap](https://c2.staticflickr.com/6/5830/21675589384_56fa290cb6_z.jpg "Beer in Europe")

### Heatmap of Whisky in Europe
![Whisky heatmap](https://c1.staticflickr.com/1/723/22110621818_23ba4eef64_z.jpg "Whisky in Europe")

Scotland!