module.exports = function( edge ) {
    var results = [];
    var he = edge.getHalfEdge();
    results.push( he.getVertex() );
    he = he.getFlipHalfEdge();
    results.push( he.getVertex() );
    return results; 
};
