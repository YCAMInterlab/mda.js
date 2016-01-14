var vec3 = require('gl-matrix').vec3;

function Vertex()
{
  this.halfEdge = undefined;
  this.index = -1;
};

Vertex.prototype.setIndex = function( index ) {
  this.index = index;
};

Vertex.prototype.getIndex = function() {
  return this.index;
};

Vertex.prototype.setHalfEdge = function( halfEdge ) {
  this.halfEdge = halfEdge;
};

Vertex.prototype.getHalfEdge = function() {
  return this.halfEdge;
};

module.exports = Vertex;
