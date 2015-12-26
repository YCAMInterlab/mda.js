function Face()
{
  this.halfEdge = undefined;  // points to one of the halfedges associated with this face
  this.index = -1;
};

Face.prototype.setIndex = function( index ) {
  this.index = index;
};

Face.prototype.getIndex = function() {
  return this.index;
};

Face.prototype.setHalfEdge = function( halfEdge ) {
  this.halfEdge = halfEdge;
};

Face.prototype.getHalfEdge = function() {
  return this.halfEdge;
};

module.exports = Face;
