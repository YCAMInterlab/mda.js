function HalfEdge()
{
  this.nextHalfEdge = undefined;  // points to the next halfedge around the current face (CCW)
  this.flipHalfEdge = undefined;  // points to the other halfedge associated with this edge
  this.vertex = undefined;        // points to the vertex at the "tail" of this halfedge
  this.edge = undefined;          // points to the edge associated with this halfedge
  this.face = undefined;          // points to the face containing this halfedge  
};

HalfEdge.prototype.setVertex = function( vertex ) {
  this.vertex = vertex;
};

HalfEdge.prototype.getVertex = function() {
  return this.vertex;
};

HalfEdge.prototype.setFace = function( face ) {
  this.face = face;
};

HalfEdge.prototype.getFace = function() {
  return this.face;
};

HalfEdge.prototype.setEdge = function( edge ) {
  this.edge = edge;
};

HalfEdge.prototype.getEdge = function() {
  return this.edge;
};

HalfEdge.prototype.setNextHalfEdge = function( nextHalfEdge ) {
  this.nextHalfEdge = nextHalfEdge;
};

HalfEdge.prototype.getNextHalfEdge = function() {
  return this.nextHalfEdge;
};

HalfEdge.prototype.setFlipHalfEdge = function( flipHalfEdge ) {
  this.flipHalfEdge = flipHalfEdge;
};

HalfEdge.prototype.getFlipHalfEdge = function() {
  return this.flipHalfEdge;
};

HalfEdge.prototype.onBoundary = function() {
  if( this.getFlipHalfEdge() ) {
    return false;
  }
  return true;
};

module.exports = HalfEdge;
