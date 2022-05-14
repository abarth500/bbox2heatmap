# bbox2heatmap

## Usage

```
npx bbox2heatmap run <ID>　--bbox=<範囲> --search=<タグ> --max=<集めたい写真の数>
```
* ***ID***: (半角英数字) 結果ファイルのファイル名になります。
* ***bbox***: ジオタグ付き写真を集める検索範囲を入力してください。以下のサイトで得られます。
    * https://boundingbox.klokantech.com/
    * ![BBOX指定方法](bbox.png)
* ***タグ***: ここで指定されたタグの付いた写真のみを収集します。(省略可)
* ***集めたい写真の数***: (整数) 数が多ければ多いほど検索に時間がかかります。10000ぐらいが良いでしょう。

## Examples

### Example1 (BBOX)
#### Heatmap of Disneyland
```(sh)
npx -y -p bbox2heatmap@latest run Disneyland.example --bbox=-117.928104,33.8034,-117.915487,33.81802 --max=10000
```
![Heatmap of Disneyland](https://c2.staticflickr.com/6/5816/22104260050_3689909114_z.jpg "Heatmap of Disneyland")

### Example2 (BBOX and Tag)
Who drinks the most beer, wine, and whisky in Europe?

#### Heatmap Whisky in Europe
```(sh)
npx -y -p bbox2heatmap@latest run whisky-in-europe.example --bbox=-19.69,36.03,26.37,59.18 --search=whisky --max=10000
```
![Whisky heatmap](https://c1.staticflickr.com/1/723/22110621818_23ba4eef64_z.jpg "Whisky in Europe")

#### Heatmap of Wine in Europe
```(sh)
npx -y -p bbox2heatmap@latest run wine-in-europe.example --bbox=-19.69,36.03,26.37,59.18 --search=wine --max=10000
```
![Wine heatmap](https://c1.staticflickr.com/1/630/21677292443_ef99646bf3_z.jpg "Wine in Europe")

#### Heatmap of Beer inEurope
```(sh)
npx -y -p bbox2heatmap@latest run beer-in-europe.example --bbox=-19.69,36.03,26.37,59.18 --search=beer --max=10000
```
![Beer heatmap](https://c2.staticflickr.com/6/5830/21675589384_56fa290cb6_z.jpg "Beer in Europe")
