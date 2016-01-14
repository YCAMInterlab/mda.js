function Edge()
{
  this.halfEdge = undefined;
  this.index = -1;
};

Edge.prototype.setIndex = function( index ) {
  this.index = index;
};

Edge.prototype.getIndex = function() {
  return this.index;
};

Edge.prototype.setHalfEdge = function( halfEdge ) {
  this.halfEdge = halfEdge;
};

Edge.prototype.getHalfEdge = function() {
  return this.halfEdge;
};

module.exports = Edge;
