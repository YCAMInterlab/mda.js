## [Half-Edge] Mesh Data Structure & Algorithms in Javascript

## Synopsis
mda.jsは、[ハーフエッジのメッシュデータ構造](http://www.flipcode.com/archives/The_Half-Edge_Data_Structure.shtml)や、メッシュデータ構造のスムージング、分割、押し出しなどの作業、また一貫性のチェックを行うヘルパー関数を含むJavascriptライブラリです。

## Code Examples
Mdaのコアデータ構造は、3Dメッシュの様々な構成要素（メッシュ、面、エッジ、頂点、ハーフエッジ）の表現を補助します。次の例は、3Dモデルからのハーフエッジメッシュ（頂点や面の指数）の作り方です:  
```js
var mda = require('mda');
var lgp = require('lgp');

var fileReader = lgp.fileReader( 'models/dodecahedron.obj', function parseObj( text ) {
  var results = lgp.objDeserializer( text, opts );
  mesh = new mda.Mesh();
  mesh.setPositions( results.positions );
  mesh.setCells( results.cells );
  mesh.process();  
  // perform operators, queries, etc
} );
```

<p style="text-align: center;">
<img src="https://cloud.githubusercontent.com/assets/555207/14068349/de028ffc-f434-11e5-96ed-cfe0032c0c94.png" width="440">
</p>

上記の例では、十二面体の各面に5つの頂点があります。WebGLを使ってこのメッシュを正確にレンダリングするには、次のように、それぞれの面が三角形になるように三角測量を行う必要があります:

```js
var mda = require('mda');
var lgp = require('lgp');
var TriangulateOperator = mda.TriangulateOperator;

var fileReader = lgp.fileReader( 'models/dodecahedron.obj', function parseObj( text ) {
  var results = lgp.objDeserializer( text, opts );
  mesh = new mda.Mesh();
  mesh.setPositions( results.positions );
  mesh.setCells( results.cells );
  mesh.process();  
  TriangulateOperator( mesh );
  // get vertices' positions and face indices for rendering in webgl:
  var positions = mesh.getPositions();
  var cells = mesh.getCells();
  // profit
} );
```
<p style="text-align: center;">
<img src="https://cloud.githubusercontent.com/assets/555207/14068398/1e1fcc38-f437-11e5-81a8-3048bccba219.png" width="440">

<img src="https://cloud.githubusercontent.com/assets/555207/14068397/1e0f1f1e-f437-11e5-90e1-7a44cfb818ea.png" width="440">
</p>

三角測量の他に、どんなタイプの3Dモデルの形成にも使える様々なメッシュオペレータを含んでいます。基本的なオペレータとして、面を内側に押し込んだり外側に押し出したりするために使える「押し出し」の機能があります:

```js
var mda = require('mda');
var lgp = require('lgp');
var ExtrudeOperator = mda.ExtrudeOperator;

var fileReader = lgp.fileReader( 'models/dodecahedron.obj', function parseObj( text ) {
  var results = lgp.objDeserializer( text, opts );
  mesh = new mda.Mesh();
  mesh.setPositions( results.positions );
  mesh.setCells( results.cells );
  mesh.process();  
  var faceIndex = 1;
  var extrudeAmount = 0.5;
  var faceShrink = 0.0;  
  ExtrudeOperator( mesh, faceIndex, extrudeAmount, faceShrink );
} );
```

<p style="text-align: center;">
<img src="https://cloud.githubusercontent.com/assets/555207/14068489/a470eb6c-f439-11e5-980b-bfe0b7403150.png" width="440">

<img src="https://cloud.githubusercontent.com/assets/555207/14068486/9b956806-f439-11e5-94f3-6a635e7c2f25.png" width="440">
</p>

そしてmda.jsには、面に属する頂点や特定の頂点に付いているエッジなど、メッシュ成分特性の検索に役立つ多くの関数が含まれています:

```js
var mda = require('mda');

var mesh = new mda.Mesh();
// process mesh by either load a model or procedurally make one

var faces = mesh.getFaces(); // is an array
var faceVertices = mda.FaceVertices( faces[ 0 ] );

var vertices = mesh.getVertices();
var vertexEdges = mda.EdgeVertices( vertices[ 0 ] );
```



## Motivation
このライブラリは、コンピュテーショナル デザイン、及びパラメトリック デザインをウェブに広めようとする、大きなライブラリのプロジェクト/シリーズの一部です。
高度なコンピューテーショナル デザインや3Dモデルの出力、Gコード生成、CNCフライス加工ツール用のパスや、レーザー切断用のパスの生成、ロボット運動計画などを可能にする、全ての複雑な形態機能を備えた数学的頭脳になることを目的としています。

## Build Requirements
node.js (4.4.0+) & npm

## Installation
このライブラリをプロジェクトに追加するためには、以下の操作を行って下さい:
```
npm install --save https://github.com/YCAMInterlab/mda.js.git
```

もしく以下の方法でも追加できます:
```
npm install --save mda
```

## Examples
See https://github.com/rezaali/webgl-sketches/tree/master/hull

## Contribution
Copyright 2015-2016 [Reza Ali](http://www.syedrezaali.com) co-developed by [YCAMInterLab](http://interlab.ycam.jp/en/) during the [Guest Research Project v.3](http://interlab.ycam.jp/en/projects/guestresearch/vol3)

## License
Apache-2.0
