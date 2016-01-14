var vec3 = require('gl-matrix').vec3;
var Vertex = require('./Vertex');
var Edge = require('./Edge');
var HalfEdge = require('./HalfEdge');
var Face = require('./Face');

function Mesh()
{
  this.halfEdges = [];    // Half - check;
  this.vertices = [];     // Vert - check
  this.edges = [];        // Edge - check
  this.faces = [];        // Face - check
  this.boundaries = [];   // Face - not done

  this.positions = [];    // For Faster Rendering
  this.cells = [];        // For Faster Rendering
  this.edgeMap = {}      // ( 1 - 3 ) <==> ( 3 - 1 )
}

Mesh.prototype.getFaces = function() {
  return this.faces;
}

Mesh.prototype.getEdges = function() {
  return this.edges;
}

Mesh.prototype.getEdgeMap = function() {
  return this.edgeMap;
}

Mesh.prototype.getVertices = function() {
  return this.vertices;
}

Mesh.prototype.getHalfEdges = function() {
  return this.halfEdges;
}

Mesh.prototype.getEdgeKey = function( vertexIndex0, vertexIndex1 ) {
  return vertexIndex0 + '-' + vertexIndex1;
}

Mesh.prototype.getEdgeKeys = function( vertexIndex0, vertexIndex1 ) {
  return [
    this.getEdgeKey( vertexIndex0, vertexIndex1 ),
    this.getEdgeKey( vertexIndex1, vertexIndex0 )
   ];
}

Mesh.prototype.containsEdge = function( vertexIndex0, vertexIndex1 ) {
  var edgeMap = this.edgeMap;
  var keys = this.getEdgeKeys( vertexIndex0, vertexIndex1 );

  if( edgeMap[ keys[ 0 ] ] !== undefined &&
      edgeMap[ keys[ 1 ] ] !== undefined ) {
    return true;
  }
  return false;
}

Mesh.prototype.getEdge = function( vertexIndex0, vertexIndex1 ) {
  var edgeMap = this.edgeMap;
  var keys = this.getEdgeKeys( vertexIndex0, vertexIndex1 );

  if( edgeMap[ keys[ 0 ] ] !== undefined &&
      edgeMap[ keys[ 1 ] ] !== undefined ) {
    return edgeMap[ keys[ 0 ] ];
  }
  return;
}

Mesh.prototype.setPositions = function( positions ) {
  this.positions = positions;
  var len = positions.length;
  for( var i = 0; i < len; i++ ) {
    var vertex = new Vertex();
    vertex.setIndex( i );
    this.vertices.push( vertex );
  }
}

Mesh.prototype.getPositions = function() {
  var results = [];
  var vertices = this.vertices;
  var positions = this.positions;
  var len = vertices.length;
  for( var i = 0; i < len; i++ ) {
    var index = vertices[ i ].getIndex();
    results.push( positions[ index ] );
  }
  return results;
}

Mesh.prototype.setCells = function( cells ) {
  this.cells = cells.slice();
  var len = cells.length;
  for( var i = 0; i < len; i++ ) {
    var face = new Face();
    face.setIndex( i );
    this.faces.push( face );
  }
  this.buildEdgeMap();
}

Mesh.prototype.getCells = function() {
  var results = [];
  var faces = this.faces;
  var vertices = this.vertices;
  var len = faces.length;
  for( var i = 0; i < len; i++ ) {
    var face = faces[ i ];
    var halfEdgeStart = halfEdge = face.getHalfEdge();
    var cell = [];
    do {
      var vertex = halfEdge.getVertex();
      var index = vertex.getIndex();
      cell.push( index );
      halfEdge = halfEdge.getNextHalfEdge();
    } while ( halfEdge != halfEdgeStart );
    results.push( cell );
  }
  return results;
}

Mesh.prototype.buildEdgeMap = function() {
  var cells = this.cells;
  var edges = this.edges;
  var edgeMap = this.edgeMap;

  var len = cells.length;
  for( var i = 0; i < len; i++ ) {
    var cell = cells[ i ];
    var flen = cell.length;

    for( var j = 0; j < flen; j++ ) {
      var i0 = cell[ j ];
      var i1 = cell[ ( j + 1 ) % flen ];

      var key0 = i0 + '-' + i1;
      var key1 = i1 + '-' + i0;

      if( edgeMap[ key0 ] === undefined && edgeMap[ key1 ] === undefined ) {
        var edge = new Edge();
        edge.setIndex( edges.length );
        edges.push( edge );
        edgeMap[ key0 ] = edge;
        edgeMap[ key1 ] = edge;
      }
    }
  }
}

Mesh.prototype.process = function() {
  var edgeMap = this.edgeMap;
  var edges = this.edges;
  var cells = this.cells;
  var vertices = this.vertices;
  var faces = this.faces;
  var halfEdges = this.halfEdges;
  var clen = cells.length;

  for( var faceIndex = 0; faceIndex < clen; faceIndex++ ) {
    var cell = cells[ faceIndex ];
    var face = faces[ faceIndex ];
    var flen = cells[ faceIndex ].length;

    var prevHalfEdge = undefined;
    var firstHalfEdge = undefined;
    for( var vertexIndex = 0; vertexIndex < flen; vertexIndex++ ) {
        var vertexIndexCurr = cell[ vertexIndex ];
        var vertexIndexNext = cell[ ( vertexIndex + 1 ) % flen ];

        var edge = edgeMap[ vertexIndexCurr + '-' + vertexIndexNext ];
        var vertex = vertices[ vertexIndexCurr ];

        //Set Half Edge Properties
        var halfedge = new HalfEdge();
        halfedge.setVertex( vertex );
        halfedge.setFace( face );
        halfedge.setEdge( edge );

        if( edge.getHalfEdge() ) {
          halfedge.setFlipHalfEdge( edge.getHalfEdge() );
          edge.getHalfEdge().setFlipHalfEdge( halfedge );
        }
        else {
          edge.setHalfEdge( halfedge );
        }

        if( prevHalfEdge !== undefined ) {
          prevHalfEdge.setNextHalfEdge( halfedge );
        }
        prevHalfEdge = halfedge;

        if( vertexIndex === 0 ) {
          firstHalfEdge = halfedge;
        }
        halfEdges.push( halfedge );
        //Set Vertex Properties
        vertex.setHalfEdge( halfedge );
    }
    //Set Face Properties
    face.setHalfEdge( firstHalfEdge );
    prevHalfEdge.setNextHalfEdge( firstHalfEdge );
  }
}

module.exports = Mesh;
