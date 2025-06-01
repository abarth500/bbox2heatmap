# bbox-to-heatmap

## Usage

### 対話型実行例

対話型で実行します。情報科学概論の講義で利用する場合はこの方法を使ってください。

```
npx -y -p bbox-to-heatmap@latest run
```
* 上記のコマンドを打つと以下のプロンプトが表示されるので、kibacoで通知されたパスワードを入力してください。
```
? パスワードを入力してください »
```
* 次に集める画像の範囲指定(BBOX)が求められます。西,南,東,北の順で緯度経度を指定します。
     * BBOXは次のページを使うと簡単に求められます：https://boundingbox.klokantech.com/
     * 使い方はこちら
         * ![BBOX指定方法](bbox.png)
```
? 検索範囲(BBOX)をカンマ区切り入力してください。 » 
```
* 最後に検索する画像をハッシュタグで限定します。集めたい写真のハッシュタグを入力してください。(例：dog,catなど・・・)
```
? 検索タグを入力してください。全ての写真を集める場合はそのままEnterを押してください。 »
```
* これで写真をFlickrから収集し始めます。20000枚集めた時点で自動終了しますが、Ctrl+Cを押すことで途中終了も可能です。終了するとブラウザが立ち上がりヒートマップが表示されます。情報科学概論受講生はスクリーンショット等で保存し発表会資料としてください。
  * 可視化ツールの使い方
    * ![可視化ツール](visualization.png)

#### 高度な実行

* 20000毎以上集めたい時はコマンドにサイズオプションを指定してください。ただし、この数に関わらず指定されたハッシュタグの写真を集め終えた時点でプログラムは終了します。
```
npx -y -p bbox-to-heatmap@latest run --max=50000
```

* 検索タグはデフォルトではカンマ区切りで複数指定した場合、OR検索となります。AND検索やタグ以外に投稿本文等からも全文検索したいときはsearchmodeオプションが使えます。
```
npx -y -p bbox-to-heatmap@latest run --searchmode=or

npx -y -p bbox-to-heatmap@latest run --searchmode=fulltext
```

* 結果をその場で表示するのではなくHTMLファイルに保存する場合は```--portable```オプションが使えます。
```
npx -y -p bbox-to-heatmap@latest run --portable
```

* **--portable**が付いていると、Webブラウザを立ち上げる代わりに、結果のHTMLファイルを出力します。WSLやSSH等、Webブラウザの使えない環境で利用してください。
    * 実行が終わると最終行に以下のように、結果可視化のためのHTMLファイルのパスが表示されるので、このファイル(index.html)を、エクスプローラーやファインダーで探し、Webブラウザに読み込みます。

```
Open C:\Users\　～省略～　\index.html
```


### コマンド型実行例

* 一度にBBOXや検索キーワード等を設定して起動したい場合は、範囲・タグはコマンドに埋め込んで実行できます。但しパスワードは埋め込めません。完全にコマンド対話をなくす場合はご自身のFlickr APIキーを取得して指定する必要があります。

```
npx -y -p bbox-to-heatmap@latest run --bbox=<範囲> --search=<タグ>


npx -y -p bbox-to-heatmap@latest run --bbox=<範囲> --search=<タグ> --apikey=<apiキー>
```

* ***bbox***: ジオタグ付き写真を集める検索範囲を入力してください。以下のサイトで得られます。
    * https://boundingbox.klokantech.com/
    * ![BBOX指定方法](bbox.png)
* ***タグ***: ここで指定されたタグの付いた写真のみを収集します。(省略すると全写真)
* ***apiキー***: [Flickrから取得するAPIキー](https://www.flickr.com/services/apps/by/me)。これを指定すればパスワードは必要ありません。


## Examples（コマンド型）

### Example1 (BBOX)
#### Heatmap of Disneyland
```(sh)
npx -y -p bbox-to-heatmap@latest run --bbox=-117.928104,33.8034,-117.915487,33.81802 --max=10000
```
![Heatmap of Disneyland](https://c2.staticflickr.com/6/5816/22104260050_3689909114_z.jpg "Heatmap of Disneyland")

##Example2 (BBOX and Tag)
Who drinks the most beer, wine, and whisky in Europe?

#### Heatmap Whisky in Europe
```(sh)
npx -y -p bbox-to-heatmap@latest run --bbox=-19.69,36.03,26.37,59.18 --search=whisky --max=10000
```
![Whisky heatmap](https://c1.staticflickr.com/1/723/22110621818_23ba4eef64_z.jpg "Whisky in Europe")

#### Heatmap of Wine in Europe
```(sh)
npx -y -p bbox-to-heatmap@latest run --bbox=-19.69,36.03,26.37,59.18 --search=wine --max=10000
```
![Wine heatmap](https://c1.staticflickr.com/1/630/21677292443_ef99646bf3_z.jpg "Wine in Europe")

#### Heatmap of Beer inEurope
```(sh)
npx -y -p bbox-to-heatmap@latest run --bbox=-19.69,36.03,26.37,59.18 --search=beer --max=10000
```
![Beer heatmap](https://c2.staticflickr.com/6/5830/21675589384_56fa290cb6_z.jpg "Beer in Europe")
