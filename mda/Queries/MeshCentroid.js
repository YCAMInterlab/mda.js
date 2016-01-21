var vec3 = require('gl-matrix').vec3;

module.exports = function( mesh ) {
  var center = vec3.create();
  var positions = mesh.positions;
  var plen = positions.length;
  for( var i = 0; i < plen; i++ ) {
    vec3.add( center, center, positions[ i ] );
  }
  vec3.scale( center, center, 1.0 / plen );
  return center; 
};
