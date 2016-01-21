var Vertex = require('./../Core/Vertex');
var Edge = require('./../Core/Edge');
var HalfEdge = require('./../Core/HalfEdge');
var Face = require('./../Core/Face');

var FaceHalfEdges = require('./../Queries/FaceHalfEdges');
var FaceVertices = require('./../Queries/FaceVertices');
var HalfEdgePrev = require('./../Queries/HalfEdgePrev');

module.exports = function( mesh, faceIndex0, faceIndex1 ) {
  var meshFaces = mesh.getFaces();

  var f0 = meshFaces[ faceIndex0 ];
  var f0HalfEdges = FaceHalfEdges( f0 );
  var f0Vertices = FaceVertices( f0 );
  var f0len = f0Vertices.length;

  var f1 = meshFaces[ faceIndex1 ];
  var f1HalfEdges = FaceHalfEdges( f1 );
  var f1Vertices = FaceVertices( f1 );
  var f1len = f1Vertices.length;

  if( f0len != f1len ) {
    throw 'faces do not have the same number of vertices, can not create pipe';
  }

  var faces = [ f0, f1 ];

  for( var i = 0; i < f0len; i++ ) {
    var v0i0 = i;
    var v0i1 = ( i + 1 ) % f0len;

    var v1i0 = ( f0len - i ) % f0len;
    var v1i1 = ( ( f0len - i ) + 1 ) % f0len;

    var oldFace = faces[ i ];
    var inputFace = oldFace ? true : false;
    var result = createFace( mesh, [
      f0Vertices[ v0i0 ],
      f0Vertices[ v0i1 ],
      f1Vertices[ v1i0 ],
      f1Vertices[ v1i1 ] ], oldFace );

    if( !inputFace ) {
      meshFaces.push( result );
    }
  }
};

function createFace( mesh, vertices, face ) {
  var meshEdgeMap = mesh.getEdgeMap();
  var meshFaces = mesh.getFaces();
  var meshHalfEdges = mesh.getHalfEdges();
  var meshEdges = mesh.getEdges();

  if( !face ) {
    face = new Face();
    face.setIndex( meshFaces.length );
  }

  var vlen = vertices.length;
  var lhe;
  var hes = [];
  for( var i = 0; i < vlen; i++ ) {
    var v0 = vertices[ i ];
    var v1 = vertices[ ( i + 1 ) % vlen ];
    var i0 = v0.getIndex();
    var i1 = v1.getIndex();

    var he = new HalfEdge();
    var edge = mesh.getEdge( i0, i1 );
    if( edge ) {
      var het = edge.getHalfEdge();
      var hetv = het.getVertex();
      if( hetv == v0 ) {
        he = het;
      }
      else {
        he.setFlipHalfEdge( het );
        het.setFlipHalfEdge( he );
      }
    }
    else {
      edge = new Edge();
      var keys = mesh.getEdgeKeys( i0, i1 );
      edge.setIndex( meshEdges.length );
      meshEdges.push( edge );
      edge.setHalfEdge( he );
      meshEdgeMap[ keys[ 0 ] ] = edge;
      meshEdgeMap[ keys[ 1 ] ] = edge;
    }

    //he
    he.setEdge( edge );
    he.setFace( face );
    he.setVertex( v0 );
    if( lhe ) {
      lhe.setNextHalfEdge( he );
    }
    hes.push( he );
    lhe = he;
    meshHalfEdges.push( he );
  }
  face.setHalfEdge( lhe );
  lhe.setNextHalfEdge( hes[ 0 ] );
  return face;
}
