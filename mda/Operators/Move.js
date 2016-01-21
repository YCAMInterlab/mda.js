var Mesh = require('./../Core/Mesh');

var vec3 = require('gl-matrix').vec3;

var tmp = vec3.create();

module.exports = function( mesh, displacement ) {
  vec3.set( tmp, 0.0, 0.0, 0.0 );
  var positions = mesh.positions;
  var plen = positions.length;
  for( var i = 0; i < plen; i++ ) {
    var pos = positions[ i ];
    vec3.subtract( pos, pos, displacement );
  }
};
