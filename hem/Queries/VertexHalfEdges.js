module.exports = function( vertex ) {
  var startHalfEdge = originalHalfEdge = he = vertex.getHalfEdge();
  var halfEdges = [];
  do {
    if( he.getNextHalfEdge() === startHalfEdge ) {
      he = he.getFlipHalfEdge();
      startHalfEdge = he;
      halfEdges.push( he );
    }
    else {
      he = he.getNextHalfEdge();
    }
  } while ( he != originalHalfEdge );
  return halfEdges;
};
