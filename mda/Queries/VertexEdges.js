var VertexHalfEdges = require('./VertexHalfEdges');
module.exports = function( vertex ) {
  var halfEdges = VertexHalfEdges( vertex );
  var hlen = halfEdges.length;
  var edges = [];
  for( var i = 0; i < hlen; i++ ) {
    edges.push( halfEdges[ i ].getEdge() );
  }
  return edges;
};
