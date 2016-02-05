var Vertex = require('./../Core/Vertex');
var Edge = require('./../Core/Edge');
var HalfEdge = require('./../Core/HalfEdge');
var Face = require('./../Core/Face');

var FaceHalfEdges = require('./../Queries/FaceHalfEdges');
var FaceVertices = require('./../Queries/FaceVertices');
var HalfEdgePrev = require('./../Queries/HalfEdgePrev');

var createFace = require('./CreateFace');

module.exports = function( mesh, faceIndex0, faceIndex1, vertexOffset ) {
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
  var offset = vertexOffset != undefined ? vertexOffset : -2;
  console.log( f0len );
  for( var i = 0; i < f0len; i++ ) {

    var v0i0 = i - offset;
    v0i0 = v0i0 >= f0len ? v0i0 % f0len : v0i0;
    v0i0 = v0i0 < 0 ? f0len + v0i0 : v0i0;
    var v0i1 = ( ( i + 1 ) % f0len ) - offset;
    v0i1 = v0i1 >= f0len ? v0i1 % f0len : v0i1;
    v0i1 = v0i1 < 0 ? f0len + v0i1 : v0i1;

    console.log( v0i0, v0i1 );

    var v1i0 = ( f0len - i ) % f0len;
    var v1i1 = ( f0len - ( i + 1 ) );
    var oldFace = faces[ i ];
    var inputFace = oldFace ? true : false;
    var result = createFace( mesh, [
      f0Vertices[ v0i0 ],
      f0Vertices[ v0i1 ],
      f1Vertices[ v1i1 ],
      f1Vertices[ v1i0 ] ], oldFace );

    if( !inputFace ) {
      meshFaces.push( result );
    }
  }

  console.log( '--------------' );
};
