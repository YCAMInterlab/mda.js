module.exports = function( face ) {
  var originalHalfEdge = he = face.getHalfEdge();
  var halfEdges = [];
  do {
    halfEdges.push( he );
    he = he.getNextHalfEdge();
  } while ( he != originalHalfEdge );
  return halfEdges;
};
