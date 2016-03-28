## [Half-Edge] Mesh Data Structure & Algorithms in Javascript

## Synopsis
mda.js is a javascript library that contains a [half-edge mesh data structure](http://www.flipcode.com/archives/The_Half-Edge_Data_Structure.shtml), helper functions that perform operators (smoothing, subdivide, extrude, etc), queries and integrity checks on the mesh data structure.

## Code Examples
mda's core data structures help represent different components of a 3D mesh (Mesh, Face, Edge, Vertex, and Half-Edge). The follow example shows how to create a half-edge mesh from a 3D model (vertices and face indices):
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

In the example above, each face of the dodecahedron has 5 vertices. If you want to properly render this mesh with webgl, then you'll need to triangulate the mesh so that each face is a triangle, like so:

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

In addition to triangulation, there are all types of fun mesh operators that can be used to make all types of 3D forms. A fundamental operator is extrude, which can be used to push a face inward or outwards:

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

Lastly, mda.js contains many query functions that are useful for retrieving mesh component properties. For example, what vertices belong to a face or which edges are attached to a particular vertex:

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
This library is part of a larger project / series of libraries that aspires to bring computational & parametric modeling / design to the web. This library aspires to be one of the core data structures that helps to model three dimensional shapes. This library aspire to enable higher level modeling for 3d printing, g-code generation, cnc milling tool path creation, laser cutting paths, robotic motion planning, and more.

## Build Requirements
node.js (4.4.0+) & npm

## Installation
You can add this library to your project by running:
```
npm install --save https://github.com/YCAMInterlab/mda.js.git
```

or via npm:
```
npm install --save mda
```

## Examples
See https://github.com/rezaali/webgl-sketches/tree/master/hull

## Contribution
Copyright 2015-2016 [Reza Ali](http://www.syedrezaali.com) co-developed by [YCAMInterLab](http://interlab.ycam.jp/en/) during the [Guest Research Project v.3](http://interlab.ycam.jp/en/projects/guestresearch/vol3)

## License
Apache-2.0
