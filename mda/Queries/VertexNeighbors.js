module.exports = function( vertex ) {
  var startHalfEdge = originalHalfEdge = he = vertex.getHalfEdge();
  var neighbors = [];
  do {
    if( he.getNextHalfEdge() === startHalfEdge ) {
      neighbors.push( he.getVertex() );
      he = he.getFlipHalfEdge();
      startHalfEdge = he;
    }
    else {
      he = he.getNextHalfEdge();
    }
  } while ( he != originalHalfEdge );
  return neighbors;
};
