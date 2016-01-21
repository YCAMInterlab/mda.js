var Mesh = require('./../Core/Mesh');
var FaceHalfEdges = require('./../Queries/FaceHalfEdges');
var FaceVertices = require('./../Queries/FaceVertices');

var vec3 = require('gl-matrix').vec3;

module.exports = function( mesh ) {
  var faces = mesh.getFaces();
  var flen = faces.length;
  for( var i = 0; i < flen; i++ ) {
    var hes = FaceHalfEdges( faces[ i ] );
    var vts = FaceVertices( faces[ i ] );
    var hlen = hes.length;
    for( var j = 0; j < hlen; j++ ) {
      var i0 = j;
      var i1 = ( j + 1 ) % hlen;

      var v0 = vts[ i0 ];
      var v1 = vts[ i1 ];

      var h0 = hes[ i0 ];
      var h1 = hes[ i1 ];
      h1.setNextHalfEdge( h0 );
      h0.setVertex( v1 );
      v1.setHalfEdge( h0 );
    }
  }
};
