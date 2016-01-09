var vec3 = require('gl-matrix').vec3;
var FaceVertices = require('./../Queries/FaceVertices');
var VertexNeighbors = require('./../Queries/VertexNeighbors');
var InsertVertex = require('./InsertVertex');
var InsertEdge = require('./InsertEdge');

module.exports = function( mesh ) {
  var positions = mesh.positions;
  var plen = positions.length;
  var newPositions = [];
  for( var i = 0; i < plen; i++ ) {
    newPositions.push( vec3.create() );
  }

  var vertices = mesh.getVertices();
  var vlen = vertices.length;
  var beta;
  for( var i = 0; i < vlen; i++ ) {
    var vertex = vertices[ i ];
    var vertexIndex = vertex.getIndex();
    var vertexPos = positions[ vertexIndex ];
    var newPos = newPositions[ vertexIndex ];

    var neighbors = VertexNeighbors( vertex );
    var nlen = neighbors.length;

    if( nlen === 3 ) {
      beta = 3.0 / 16.0;
    }
    else if( nlen > 3 ) {
      beta = ( ( 5.0 / 8.0 ) - Math.pow( ( 0.375 + 0.25 * Math.cos( ( Math.PI * 2.0 ) / nlen ) ), 2.0 ) ) / nlen;
    }

    vec3.scaleAndAdd( newPos, newPos, vertexPos, ( 1.0 - nlen * beta ) );

    for( var j = 0; j < nlen; j++ ) {
      var neighborPos = positions[ neighbors[ j ].getIndex() ];
      vec3.scaleAndAdd( newPos, newPos, neighborPos, beta );
    }
  }

  var edges = mesh.getEdges();
  var len = edges.length;
  var newVerts = [];
  var vertexAdjacentFactor = 0.375;
  var vertexOppositeFactor = 0.125;

  var newPos = vec3.create();
  for( var i = 0; i < len; i++ ) {
    vec3.set( newPos, 0, 0, 0 );
    var edge = edges[ i ];
    var halfEdge = edge.getHalfEdge();
    var halfEdgeFlip = halfEdge.getFlipHalfEdge();
    var halfEdgeTop = halfEdge.getNextHalfEdge().getNextHalfEdge();
    var halfEdgeFlipTop = halfEdgeFlip.getNextHalfEdge().getNextHalfEdge();

    var halfEdgeVertex = halfEdge.getVertex();
    var halfEdgeFlipVertex = halfEdgeFlip.getVertex();
    var halfEdgeTopVertex = halfEdgeTop.getVertex();
    var halfEdgeFlipTopVertex = halfEdgeFlipTop.getVertex();

    var halfEdgeVertexPos = positions[ halfEdgeVertex.getIndex() ];
    var halfEdgeFlipVertexPos = positions[ halfEdgeFlipVertex.getIndex() ];
    var halfEdgeTopVertexPos = positions[ halfEdgeTopVertex.getIndex() ];
    var halfEdgeFlipTopVertexPos = positions[ halfEdgeFlipTopVertex.getIndex() ];

    vec3.scaleAndAdd( newPos, newPos, halfEdgeVertexPos, vertexAdjacentFactor );
    vec3.scaleAndAdd( newPos, newPos, halfEdgeFlipVertexPos, vertexAdjacentFactor );
    vec3.scaleAndAdd( newPos, newPos, halfEdgeTopVertexPos, vertexOppositeFactor );
    vec3.scaleAndAdd( newPos, newPos, halfEdgeFlipTopVertexPos, vertexOppositeFactor );

    newVerts.push( InsertVertex( mesh, edge.getIndex(), newPos ) );
  }

  var faces = mesh.getFaces();
  var flen = faces.length;
  var result;
  for( var i = 0; i < flen; i++ ) {
    var face = faces[ i ];
    var vertices = FaceVertices( face );
    var vlen = vertices.length;

    var v1 = vertices[ 1 ];
    var v3 = vertices[ 3 ];
    var v5 = vertices[ 5 ];

    result = InsertEdge( mesh, face.getIndex(), v1.getIndex(), v3.getIndex() );
    result = InsertEdge( mesh, result.face.getIndex(), v3.getIndex(), v5.getIndex() );
    result = InsertEdge( mesh, result.face.getIndex(), v5.getIndex(), v1.getIndex() );
  }

  for( var i = 0; i < plen; i++ ) {
    vec3.copy( positions[ i ], newPositions[ i ] );
  }
};
