module.exports = function( face ) {
  var originalHalfEdge = he = face.getHalfEdge();
  var vertices = [];
  do {
    vertices.push( he.getVertex() );
    he = he.getNextHalfEdge();
  } while ( he != originalHalfEdge );
  return vertices;
};
