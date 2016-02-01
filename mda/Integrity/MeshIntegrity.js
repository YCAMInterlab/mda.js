var Integrity = require('./Integrity');

module.exports = function( mesh ) {
  var passed = true;
  console.log( 'checking faces' );
  if( !Integrity.checkFaces( mesh.getFaces() ) ) {
    console.log( 'faces are messed up' );
    passed = false;
  }

  console.log( 'checking edges' );
  if( !Integrity.checkEdges( mesh.getEdges() ) ) {
    console.log( 'edges are messed up' );
    passed = false;
  }

  console.log( 'checking vertices' );
  if( !Integrity.checkVertices( mesh.getVertices() ) ) {
    console.log( 'vertices are messed up' );
    passed = false;
  }

  console.log( 'checking halfedges' );
  if( !Integrity.checkHalfEdges( mesh.getHalfEdges() ) ) {
    console.log( 'half edges are messed up' );
    passed = false;
  }

  console.log( 'mesh is valid!' );
  return passed;
};
