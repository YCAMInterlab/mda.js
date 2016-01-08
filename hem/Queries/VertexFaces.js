module.exports = function( vertex ) {
  var startHalfEdge = originalHalfEdge = he = vertex.getHalfEdge();
  var faces = [];
  do {
    if( he.getNextHalfEdge() === startHalfEdge ) {
      faces.push( he.getFace() );
      he = he.getFlipHalfEdge();
      startHalfEdge = he;
    }
    else {
      he = he.getNextHalfEdge();
    }
  } while ( he != originalHalfEdge );
  return faces;
};
