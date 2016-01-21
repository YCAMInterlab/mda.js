var MeshCentroid = require('./../Queries/MeshCentroid');

var vec3 = require('gl-matrix').vec3;

var tmp = vec3.create();

module.exports = function( mesh, scale ) {
  if( scale.constructor != Array ) {
    scale = [ scale, scale, scale ];
  }
  vec3.set( tmp, 0.0, 0.0, 0.0 );
  var centroid = MeshCentroid( mesh );
  var positions = mesh.positions;
  var plen = positions.length;
  for( var i = 0; i < plen; i++ ) {
    var pos = positions[ i ];
    vec3.subtract( pos, pos, centroid );
    vec3.multiply( pos, pos, scale );
    vec3.add( pos, pos, centroid );
  }
};
