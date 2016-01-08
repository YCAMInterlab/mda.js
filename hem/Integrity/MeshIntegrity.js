var Integrity = require('./Integrity');

module.exports = function( mesh ) {
  var passed = true;
  if( !Integrity.checkFaces( mesh.getFaces() ) ) {
    console.log( 'faces are messed up' );
    passed = false;
  }

  if( !Integrity.checkEdges( mesh.getEdges() ) ) {
    console.log( 'edges are messed up' );
    passed = false;
  }

  if( !Integrity.checkVertices( mesh.getVertices() ) ) {
    console.log( 'vertices are messed up' );
    passed = false;
  }

  if( !Integrity.checkHalfEdges( mesh.getHalfEdges() ) ) {
    console.log( 'half edges are messed up' );
    passed = false;
  }

  console.log( 'mesh is valid!' );
  return passed;
};
