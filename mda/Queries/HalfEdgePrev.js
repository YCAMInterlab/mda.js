module.exports = function( he ) {
  var startHalfEdge = he;
  while ( he.getNextHalfEdge() != startHalfEdge ) {
    he = he.getNextHalfEdge();
  }  
  return he;
};
