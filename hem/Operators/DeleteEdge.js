var Face = require('./../Core/Face');
var Edge = require('./../Core/Edge');
var HalfEdge = require('./../Core/HalfEdge');
var HalfEdgePrev = require('./../Queries/HalfEdgePrev');

module.exports = function( mesh, edgeIndex ) {
  var edges = mesh.getEdges();
  var edge = edges[ edgeIndex ];
  
  var edgeHalfEdge = edge.getHalfEdge();
  var edgeHalfEdgePrev = HalfEdgePrev( edgeHalfEdge );
  var edgeHalfEdgeNext = edgeHalfEdge.getNextHalfEdge();
  var edgeHalfEdgeVertex = edgeHalfEdge.getVertex();
  var edgeHalfEdgeFace = edgeHalfEdge.getFace();

  var edgeHalfEdgeFlip = edgeHalfEdge.getFlipHalfEdge();
  var edgeHalfEdgeFlipPrev = HalfEdgePrev( edgeHalfEdgeFlip );
  var edgeHalfEdgeFlipNext = edgeHalfEdgeFlip.getNextHalfEdge();
  var edgeHalfEdgeFlipVertex = edgeHalfEdgeFlip.getVertex();
  var edgeHalfEdgeFlipFace = edgeHalfEdgeFlip.getFace();

  // Set Face Half Edge
  edgeHalfEdgeFace.setHalfEdge( edgeHalfEdgeNext );
  //Set Half Edge Face Properties
  edgeHalfEdgePrev.setNextHalfEdge( edgeHalfEdgeFlipNext );
  edgeHalfEdgeVertex.setHalfEdge( edgeHalfEdgeFlipNext );

  // Set Half Edge Flip Face Properties
  edgeHalfEdgeFlipPrev.setNextHalfEdge( edgeHalfEdgeNext );
  edgeHalfEdgeFlipVertex.setHalfEdge( edgeHalfEdgeNext );

  // Remove Half Edge Flip Face
  var faces = mesh.getFaces();
  faces.splice( edgeHalfEdgeFlipFace.getIndex(), 1 );
  var flen = faces.length;
  for( var i = 0; i < flen; i++ ) {
    faces[ i ].setIndex( i );
  }

  // Remove Edge from Edges Array
  edges.splice( edgeIndex, 1 );
  var elen = edges.length;
  for( var i = 0; i < elen; i++ ) {
    edges[ i ].setIndex( i );
  }

  // Remove Edge from Edge Hash Map
  var keys = mesh.getEdgeKeys( edgeHalfEdgeVertex.getIndex(), edgeHalfEdgeFlipVertex.getIndex() );
  var edgeMap = mesh.getEdgeMap();
  delete edgeMap[ keys[ 0 ] ];
  delete edgeMap[ keys[ 1 ] ];
};
