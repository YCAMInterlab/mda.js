var FaceVertices = require('./../Queries/FaceVertices');
var calculateNormal = require('guf').calculateNormal;
var triangulatePolygon = require('cga').triangulatePolygon2;
var vec3 = require('gl-matrix').vec3;
var quat = require('gl-matrix').quat;
var InsertEdge = require('./InsertEdge');

module.exports = function( mesh ) {
  var positions = mesh.positions;
  var faces = mesh.getFaces();
  var flen = faces.length;
  var zAxis = vec3.fromValues( 0.0, 0.0, 1.0 );
  var res = {};
  for( var i = 0; i < flen; i++ ) {
    var face = faces[ i ];
    var vertices = FaceVertices( face );
    var vlen = vertices.length;
    if( vlen === 3 ) { continue; }

    var v0 = positions[ vertices[ 0 ].getIndex() ];
    var v1 = positions[ vertices[ 1 ].getIndex() ];
    var v2 = positions[ vertices[ 2 ].getIndex() ];

    var normal = calculateNormal( v0, v1, v2 );
    var faceOri = quat.create();
    quat.rotationTo( faceOri, normal, zAxis );

    var polygon = [];
    var indicies = [];
    for( var j = 0; j < vlen; j++ ) {
      var vertex = vertices[ j ];
      var vertexIndex = vertex.getIndex();
      var vertexPos = vec3.clone( positions[ vertexIndex ] );
      vec3.transformQuat( vertexPos, vertexPos, faceOri );
      polygon.push( [ vertexPos[ 0 ], vertexPos[ 1 ] ] );
      indicies.push( vertexIndex );
    }
    var results = triangulatePolygon( polygon );
    var rlen = results.length;
    for( var k = 0; k < rlen; k++ ) {
      var result = results[ k ];

      var i0 = indicies[ result[ 0 ] ];
      var i1 = indicies[ result[ 1 ] ];
      var i2 = indicies[ result[ 2 ] ];

      InsertEdge( mesh, face.getIndex(), i0, i1 );
      InsertEdge( mesh, face.getIndex(), i1, i2 );
      InsertEdge( mesh, face.getIndex(), i2, i0 );
    }
  }
};
