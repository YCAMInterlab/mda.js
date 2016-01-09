var vec3 = require('gl-matrix').vec3;
var Face = require('./../Core/Face');
var Edge = require('./../Core/Edge');
var Vertex = require('./../Core/Vertex');
var HalfEdge = require('./../Core/HalfEdge');

module.exports = function( mesh, edgeIndex, position ) {
  // when you create a new vertex
  // you create a new edge
  // you create two new half edges
  // you create a new vertex
  var edges = mesh.getEdges();
  var halfEdges = mesh.getHalfEdges();
  var edgeMap = mesh.getEdgeMap();
  var vertices = mesh.getVertices();
  var positions = mesh.positions;                 //hack fix this <-

  var originalEdge = edges[ edgeIndex ];
  var originalHalfEdge = originalEdge.getHalfEdge();
  var originalHalfEdgeFace = originalHalfEdge.getFace();
  var originalHalfEdgeNext = originalHalfEdge.getNextHalfEdge();
  var originalHalfEdgeFlip = originalHalfEdge.getFlipHalfEdge();

  var originalVertex = originalHalfEdge.getVertex();
  var originalVertexIndex = originalVertex.getIndex();
  var originalVertexPosition = positions[ originalVertexIndex ];

  var originalVertexNext = originalHalfEdgeNext.getVertex();
  var originalVertexNextIndex = originalVertexNext.getIndex();
  var originalVertexNextPosition = positions[ originalVertexNextIndex ];

  var newEdge = new Edge();
  var newVertex = new Vertex();
  var newHalfEdge = new HalfEdge();
  var newHalfEdgeFlip = new HalfEdge();

  //Set New Vertex Properties
  var newVertexIndex = positions.length;
  var newVertexPosition = vec3.create();
  if( position !== undefined ) {
    vec3.copy( newVertexPosition, position );
  }
  else {
    vec3.add( newVertexPosition, originalVertexPosition, originalVertexNextPosition );
    vec3.scale( newVertexPosition, newVertexPosition, 0.5 );
  }

  newVertex.setIndex( newVertexIndex );
  newVertex.setHalfEdge( newHalfEdge );
  positions.push( newVertexPosition );
  vertices.push( newVertex );

  //Set New Half Edge Properties
  newHalfEdge.setVertex( newVertex );
  newHalfEdge.setFace( originalHalfEdgeFace );
  newHalfEdge.setNextHalfEdge( originalHalfEdgeNext );
  newHalfEdge.setFlipHalfEdge( originalHalfEdgeFlip );
  newHalfEdge.setEdge( newEdge );

  // Set Original Half Edge Properties
  originalHalfEdge.setNextHalfEdge( newHalfEdge );
  originalHalfEdge.setFlipHalfEdge( newHalfEdgeFlip );

  //fix Edge map
  var originalEdgeKey0Old = originalVertexIndex + '-' + originalVertexNextIndex;
  var originalEdgeKey1Old = originalVertexNextIndex + '-' + originalVertexIndex;
  delete edgeMap[ originalEdgeKey0Old ];    //deletes edge key
  delete edgeMap[ originalEdgeKey1Old ];    //deletes edge key

  var originalEdgeKey0New = originalVertexIndex + '-' + newVertexIndex;
  var originalEdgeKey1New = newVertexIndex + '-' + originalVertexIndex;

  edgeMap[ originalEdgeKey0New ] = originalEdge;
  edgeMap[ originalEdgeKey1New ] = originalEdge;

  newEdge.setIndex( edges.length );
  edges.push( newEdge );
  newEdge.setHalfEdge( newHalfEdge );

  var newEdgeKey0 = newVertexIndex + '-' + originalVertexNextIndex;
  var newEdgeKey1 = originalVertexNextIndex + '-' + newVertexIndex;

  edgeMap[ newEdgeKey0 ] = newEdge;
  edgeMap[ newEdgeKey1 ] = newEdge;

  // Set original half edge flip properties

  var originalHalfEdgeFlipFace = originalHalfEdgeFlip.getFace();
  var originalHalfEdgeFlipNext = originalHalfEdgeFlip.getNextHalfEdge();
  originalHalfEdgeFlip.setNextHalfEdge( newHalfEdgeFlip );
  originalHalfEdgeFlip.setFlipHalfEdge( newHalfEdge );
  originalHalfEdgeFlip.setEdge( newEdge );

  newHalfEdgeFlip.setNextHalfEdge( originalHalfEdgeFlipNext );
  newHalfEdgeFlip.setFlipHalfEdge( originalHalfEdge );
  newHalfEdgeFlip.setVertex( newVertex );
  newHalfEdgeFlip.setEdge( originalEdge );
  newHalfEdgeFlip.setFace( originalHalfEdgeFlipFace );
  halfEdges.push( newHalfEdgeFlip );

  return newVertex;
}
