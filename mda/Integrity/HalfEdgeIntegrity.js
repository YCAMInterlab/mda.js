var HalfEdgePrev = require('./../Queries/HalfEdgePrev');

module.exports = function( halfEdge ) {
  var passed = true;
  var he = halfEdge;
  if( he.getNextHalfEdge() === undefined ) {
    console.log( 'halfEdge: does not have a next half edge' );
    passed = false;
  }
  if( he.getFlipHalfEdge() === undefined ) {
    console.log( 'halfEdge: does not have a flip half edge' );
    passed = false;
  }
  if( HalfEdgePrev( he ) === undefined ) {
    console.log( 'halfEdge: does not have a prev half edge' );
    passed = false;
  }
  if( he.getVertex() === undefined ) {
    console.log( 'halfEdge: does not have a valid vertex' );
    passed = false;
  }
  if( he.getEdge() === undefined ) {
    console.log( 'halfEdge: does not have an edge' );
    passed = false;
  }
  if( he.getFace() === undefined ) {
    console.log( 'halfEdge: does not have a face' );
    passed = false;
  }
  return passed;
};
