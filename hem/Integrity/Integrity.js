var FaceIntegrity = require('./FaceIntegrity');
var EdgeIntegrity = require('./EdgeIntegrity');
var VertexIntegrity = require('./VertexIntegrity');
var HalfEdgeIntegrity = require('./HalfEdgeIntegrity');

var Integrity = {};

Integrity.checkMesh = function( mesh ) {
  var passed = true;
  if( !this.checkFaces( mesh.getFaces() ) ) {
    console.log( 'faces are messed up' );
    passed = false;
  }

  if( !this.checkEdges( mesh.getEdges() ) ) {
    console.log( 'edges are messed up' );
    passed = false;
  }

  if( !this.checkVertices( mesh.getVertices() ) ) {
    console.log( 'vertices are messed up' );
    passed = false;
  }

  if( !this.checkHalfEdges( mesh.getHalfEdges() ) ) {
    console.log( 'half edges are messed up' );
    passed = false;
  }

  console.log( 'mesh is valid!' );
  return passed;
}

Integrity.checkEdges = function( edges ) {
  var passed = true;
  var len = edges.length;
  for( var i = 0; i < len; i++ ) {
    var edge = edges[ i ];
    passed = EdgeIntegrity( edge );
  }
  return passed;
}

Integrity.checkFaces = function( faces ) {
  var passed = true;
  var len = faces.length;
  for( var i = 0; i < len; i++ ) {
    var face = faces[ i ];
    passed = FaceIntegrity( face );
  }
  return passed;
}

Integrity.checkVertices = function( vertices ) {
  var passed = true;
  var len = vertices.length;
  for( var i = 0; i < len; i++ ) {
    var vertex = vertices[ i ];
    passed = VertexIntegrity( vertex );
  }
  return passed;
}

Integrity.checkHalfEdges = function( halfEdges ) {
  var passed = true;
  var len = halfEdges.length;
  for( var i = 0; i < len; i++ ) {
    var halfedge = halfEdges[ i ];
    passed = HalfEdgeIntegrity( halfedge );
  }
  return passed;
}

module.exports = Integrity; 
