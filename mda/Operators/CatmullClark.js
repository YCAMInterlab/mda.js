var vec3 = require('gl-matrix').vec3;
var VertexNeighbors = require('./../Queries/VertexNeighbors');
var FaceVertices = require('./../Queries/FaceVertices');
var FaceHalfEdges = require('./../Queries/FaceHalfEdges');
var VertexHalfEdges = require('./../Queries/VertexHalfEdges');
var InsertVertex = require('./InsertVertex');
var InsertEdge = require('./InsertEdge');

module.exports = function( mesh ) {
  var newPositions = [];
  var positions = mesh.positions;
  var plen = positions.length;
  for( var i = 0; i < plen; i++ ) {
    newPositions.push( vec3.clone( positions[ i ] ) );
  }

  var tmp = vec3.create();
  var newPos = vec3.create();
  //calculate new original vertex positions
  var vertices = mesh.getVertices();
  var vlen = vertices.length;
  for( var i = 0; i < vlen; i++ ) {
      var vertex = vertices[ i ];
      var vertexIndex = vertex.getIndex();
      var vertexPos = positions[ vertexIndex ];

      var neighbors = VertexHalfEdges( vertex );
      var nlen = neighbors.length;

      var kernel = [];
      switch ( nlen ) {
        case 3: {
          kernel.push( 15.0 / 36.0, 6.0 / 36.0, 1.0 / 36.0 );
        }
          break;
        case 4: {
          kernel.push( 36.0 / 64.0, 6.0 / 64.0, 1.0 / 64.0 );
        }
          break;
        case 5: {
          kernel.push( 65.0 / 100.0, 6.0 / 100.0, 1.0 / 100.0 );
        }
          break;
      }

      vec3.copy( newPos, vertexPos );
      vec3.scale( newPos, newPos, kernel[ 0 ] );

      for( var j = 0; j < nlen; j++ ) {
        var he = neighbors[ j ];

        var hen = he.getNextHalfEdge();
        var v0iPos = positions[ hen.getVertex().getIndex() ];
        vec3.scaleAndAdd( newPos, newPos, v0iPos, kernel[ 1 ] );

        var henn = hen.getNextHalfEdge();
        var v1iPos = positions[ henn.getVertex().getIndex() ];
        vec3.scaleAndAdd( newPos, newPos, v1iPos, kernel[ 2 ] );
      }
      vec3.copy( newPositions[ vertexIndex ], newPos );
  }

  //Calculate Face Verts
  var faceVerticesPosHash = {};
  var faces = mesh.getFaces();
  var flen = faces.length;
  for( var i = 0; i < flen; i++ ) {
    var face = faces[ i ];
    var faceVertices = FaceVertices( face );
    var vlen = faceVertices.length;
    var faceVertexPos = vec3.create();
    faceVerticesPosHash[ face.getIndex() ] = faceVertexPos;

    for( var j = 0; j < vlen; j++ ) {
      var vertex = faceVertices[ j ];
      var vertexIndex = vertex.getIndex();
      var vertexPos = positions[ vertexIndex ];
      vec3.scaleAndAdd( faceVertexPos, faceVertexPos, vertexPos, 1.0 / 4.0 );
    }
  }

  //Calculate Edge Verts
  var edgeVerticesPosHash = {};
  var edges = mesh.getEdges();
  var elen = edges.length;
  for( var i = 0; i < elen; i++ ) {
    var edge = edges[ i ];

    var edgeVertexPos = vec3.create();
    edgeVerticesPosHash[ edge.getIndex() ] = edgeVertexPos;

    var he = edge.getHalfEdge();
    var heVertex = he.getVertex();
    var heVertexPos = positions[ heVertex.getIndex() ];
    vec3.scaleAndAdd( edgeVertexPos, edgeVertexPos, heVertexPos, 6.0 / 16.0 );

    var heVertexPos0 = positions[ he.getNextHalfEdge().getNextHalfEdge().getVertex().getIndex() ];
    var heVertexPos1 = positions[ he.getNextHalfEdge().getNextHalfEdge().getNextHalfEdge().getVertex().getIndex() ];

    vec3.scaleAndAdd( edgeVertexPos, edgeVertexPos, heVertexPos0, 1.0 / 16.0 );
    vec3.scaleAndAdd( edgeVertexPos, edgeVertexPos, heVertexPos1, 1.0 / 16.0 );

    var hef = he.getFlipHalfEdge();
    var hefVertex = hef.getVertex();
    var hefVertexPos = positions[ hefVertex.getIndex() ];
    vec3.scaleAndAdd( edgeVertexPos, edgeVertexPos, hefVertexPos, 6.0 / 16.0 );

    var hefVertexPos0 = positions[ hef.getNextHalfEdge().getNextHalfEdge().getVertex().getIndex() ];
    var hefVertexPos1 = positions[ hef.getNextHalfEdge().getNextHalfEdge().getNextHalfEdge().getVertex().getIndex() ];

    vec3.scaleAndAdd( edgeVertexPos, edgeVertexPos, hefVertexPos0, 1.0 / 16.0 );
    vec3.scaleAndAdd( edgeVertexPos, edgeVertexPos, hefVertexPos1, 1.0 / 16.0 );
  }

  // console.log( edgeVerticesPosHash );
  // insert edges and set vertex positions


  for( var i = 0; i < elen; i++ ) {
    var edge = edges[ i ];
    var edgeIndex = edge.getIndex();
    InsertVertex( mesh, edge.getIndex(), edgeVerticesPosHash[ edgeIndex ] );
  }

  var edgeVertices = {};
  for( var i = 0; i < flen; i++ ) {
    var face = faces[ i ];
    edgeVertices[ face.getIndex() ] = [];
    var vertices = FaceVertices( face );
    var vlen = vertices.length;
    for( var j = 0; j < vlen; j++ ) {
      var vertex = vertices[ j ];
      var neighbors = VertexNeighbors( vertex );
      if( neighbors.length == 2 ) {
        edgeVertices[ face.getIndex() ].push( vertex );
      }
    }
  }

  var keys = Object.keys( edgeVertices );
  for( var i = 0; i < keys.length; i++ ) {
    var faceIndex = keys[ i ];
    var vertices = edgeVertices[ faceIndex ];
    var v0 = vertices[ 0 ];
    var v1 = vertices[ 1 ];
    var v2 = vertices[ 2 ];
    var v3 = vertices[ 3 ];
    var result = InsertEdge( mesh, faceIndex, v0.getIndex(), v2.getIndex() );
    var cv = InsertVertex( mesh, result.edge.getIndex(), faceVerticesPosHash[ faceIndex ] );
    edgeVertices[ faceIndex ].push( cv );
    InsertEdge( mesh, faceIndex, v1.getIndex(), cv.getIndex() );
    InsertEdge( mesh, result.face.getIndex(), v3.getIndex(), cv.getIndex() );
  }

  for( var i = 0; i < plen; i++ ) {
    vec3.copy( positions[ i ], newPositions[ i ] );
  }
};
