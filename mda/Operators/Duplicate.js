var Mesh = require('./../Core/Mesh');

var vec3 = require('gl-matrix').vec3;

module.exports = function( mesh ) {
  var newMesh = new Mesh();
  var newPositions = [];
  var positions = mesh.getPositions();
  var plen = positions.length;
  for( var i = 0; i < plen; i++ ) {
    newPositions.push( vec3.clone( positions[ i ] ) );
  }
  newMesh.setPositions( newPositions );
  newMesh.setCells( mesh.getCells() );
  newMesh.process();
  return newMesh;
};
