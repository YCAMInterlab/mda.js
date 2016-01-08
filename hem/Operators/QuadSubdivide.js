var vec3 = require('gl-matrix').vec3;
var VertexNeighbors = require('./../Queries/VertexNeighbors');
var FaceVertices = require('./../Queries/FaceVertices');
var CreateVertex = require('./CreateVertex');
var InsertEdge = require('./InsertEdge');

module.exports = function( mesh ) {
  var edges = mesh.getEdges();
  var elen = edges.length;
  var edgeVertices = {};

  for( var i = 0; i < elen; i++ ) {
    var edge = edges[ i ];
    CreateVertex( mesh, edge.getIndex() );
  }

  var faces = mesh.getFaces();
  var flen = faces.length;
  for( var i = 0; i < flen; i++ ) {
    var face = faces[ i ];
    edgeVertices[ face.getIndex() ] = [];
    var vertices = FaceVertices( face );
    var vlen = vertices.length;
    for( var j = 0; j < vlen; j++ ) {
      var vertex = vertices[ j ];
      var neighbors = VertexNeighbors( vertex );
      if( neighbors.length == 2 ) {
        edgeVertices[ face.getIndex() ].push( vertex );
      }
    }
  }

  var keys = Object.keys( edgeVertices );
  for( var i = 0; i < keys.length; i++ ) {
    var faceIndex = keys[ i ];
    var vertices = edgeVertices[ faceIndex ];
    var v0 = vertices[ 0 ];
    var v1 = vertices[ 1 ];
    var v2 = vertices[ 2 ];
    var v3 = vertices[ 3 ];
    var result = InsertEdge( mesh, faceIndex, v0.getIndex(), v2.getIndex() );
    var cv = CreateVertex( mesh, result.edge.getIndex() );
    edgeVertices[ faceIndex ].push( cv );
    InsertEdge( mesh, faceIndex, v1.getIndex(), cv.getIndex() );
    InsertEdge( mesh, result.face.getIndex(), v3.getIndex(), cv.getIndex() );
  }
};
