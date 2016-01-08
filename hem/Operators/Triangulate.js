var FaceVertices = require('./../Queries/FaceVertices');

var vec3 = require('gl-matrix').vec3;
var quat = require('gl-matrix').quat;
var InsertEdge = require('./InsertEdge');

module.exports = function( mesh ) {

  // console.log('triangulate');
  // var faces = mesh.getFaces();
  // for( var i = 0; i < faces.length; i++ ) {
  //   var face = faces[ i ];
  //   var faceIndex = face.getIndex();
  //   var vertexIndicies = [];
  //   var faceHalfEdge = he = face.getHalfEdge();
  //   do {
  //     vertexIndicies.push( he.getVertex().getIndex() );
  //     he = he.getNextHalfEdge();
  //   } while ( he != faceHalfEdge );
  //
  //   var vlen = vertexIndicies.length;
  //   if( vlen > 3 ) {
  //     InsertEdge( mesh, faceIndex, vertexIndicies[ 0 ], vertexIndicies[ 2 ] );
  //   }
  // }

  var positions = mesh.positions;
  var faces = mesh.getFaces();
  for( var i = 0; i < 1; i++ ) {
    var face = faces[ i ];
    var vertices = FaceVertices( face );
    var vlen = vertices.length;
    for( var j = 0; j < vlen; j++ ) {
      var vertexPos = positions[ vertices[ j ].getIndex() ];

      vec3.set( vertexPos, 0.0, 0.0, 0.0 );
    }
  }
};
