# bbox2heatmap

## Usage

```(sh)
node execute.js -bbox=[west,south,east,north] -search=[search keyword] --max=[maximum number of photographs]
```
OR
```(JavaScript)
BBOX2Heatmap([west,south,east,north],{search:"keyword",max:maximum-number-of-photographs});
```

## Install

```(sh)
npm install bbox2heatmap
```

Set your Flickr API key and secret into value.js (See also the template, value-original.js)

```(JavaScript)
{
  "flickr_options": {
    "api_key": "01234567890123456789012345678901",
    "secret": "1234567890123456"
  }
}
```

##Usage
### Step1: Crawling
See Help.
```(sh)
node execute.js --help
```

### Step2: Visualize
1. Open "bbox2heatmap/output/index.html"
2. Open result JSON file.

## Examples

### Example1 (BBOX)
#### Heatmap of Disneyland
```(sh)
node execute.js Disneyland.example --bbox=-117.928104,33.8034,-117.915487,33.81802 --max=10000
```
![Heatmap of Disneyland](https://c2.staticflickr.com/6/5816/22104260050_3689909114_z.jpg "Heatmap of Disneyland")

### Example2 (BBOX and Tag)
Who drinks the most beer, wine, and whisky in Europe?

#### Heatmap Whisky in Europe
```(sh)
node execute.js whisky-in-europe.example --bbox=-19.69,36.03,26.37,59.18 --search=whisky --max=10000
```
![Whisky heatmap](https://c1.staticflickr.com/1/723/22110621818_23ba4eef64_z.jpg "Whisky in Europe")

#### Heatmap of Wine in Europe
```(sh)
node execute.js wine-in-europe.example --bbox=-19.69,36.03,26.37,59.18 --search=wine --max=10000
```
![Wine heatmap](https://c1.staticflickr.com/1/630/21677292443_ef99646bf3_z.jpg "Wine in Europe")

#### Heatmap of Beer inEurope
```(sh)
node  execute.js beer-in-europe.example --bbox=-19.69,36.03,26.37,59.18 --search=beer --max=10000
```
![Beer heatmap](https://c2.staticflickr.com/6/5830/21675589384_56fa290cb6_z.jpg "Beer in Europe")

### Example3 (BBOX and TrackID)
#### Heatmap of Oktobarfest with my trajectory
```(sh)
node execute.js Oktoberfest.example --bbox=11.543283,48.12657,11.554785,48.137053 --track=40287908@N02 --max=50000
```
![Heatmap of Oktobarfest](https://c1.staticflickr.com/1/576/22105477479_2592e6146f_z.jpg "Heatmap of Oktobarfest")
