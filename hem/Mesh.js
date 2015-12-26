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
  this.edgeMap = {};      // ( 1 - 3 ) <==> ( 3 - 1 )
};

Mesh.prototype.getEdgeKey = function( vertexIndex0, vertexIndex1 )
{
  return vertexIndex0 + '-' + vertexIndex1;
}

Mesh.prototype.getEdgeKeys = function( vertexIndex0, vertexIndex1 )
{
  return [
    this.getEdgeKey( vertexIndex0, vertexIndex1 ),
    this.getEdgeKey( vertexIndex1, vertexIndex0 )
   ];
}

Mesh.prototype.containsEdge = function( vertexIndex0, vertexIndex1 )
{
  var edgeMap = this.edgeMap;
  var keys = this.getEdgeKeys( vertexIndex0, vertexIndex1 );

  if( edgeMap[ keys[ 0 ] ] !== undefined &&
      edgeMap[ keys[ 1 ] ] !== undefined ) {
    return true;
  }
  return false;
}

Mesh.prototype.setPositions = function( positions ) {
  this.positions = positions.slice();
  var len = positions.length;
  for( var i = 0; i < len; i++ ) {
    var vertex = new Vertex();
    vertex.setIndex( i );
    this.vertices.push( vertex );
  }
};

// Mesh.prototype.getPositions = function() {
//   return this.positions;
// };

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
};

Mesh.prototype.setCells = function( cells ) {
  this.cells = cells.slice();
  var len = cells.length;
  for( var i = 0; i < len; i++ ) {
    var face = new Face();
    face.setIndex( i );
    this.faces.push( face );
  }
  this.buildEdgeMap();
};

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
};

// Mesh.prototype.getCells = function() {
//   return this.cells;
// };

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
};

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
};

Mesh.prototype.smooth = function() {
  console.log( 'smoothing using loop subdivision' );


  // this.halfEdges = [];    // Half - check;
  // this.vertices = [];     // Vert - check
  // this.edges = [];        // Edge - check
  // this.faces = [];        // Face - check
  // this.boundaries = [];   // Face - not done
  //
  // this.positions = [];    // For Faster Rendering
  // this.cells = [];        // For Faster Rendering
  // this.edgeMap = {};      // ( 1 - 3 ) <==> ( 3 - 1 )

  var edges = this.edges;
  var len = edges.length;
  for( var i = 0; i < len; i++ ) {
    this.createVertex( i );
  }
};

Mesh.prototype.triangulate = function() {
  if( !this.checkIntegrity() ) {
    console.log( 'mesh integrity error' );
    return;
  }

  for( var i = 0; i < this.faces.length; i++ ) {
    var face = this.faces[ i ];
    var faceIndex = face.getIndex();
    var vertexIndicies = [];
    var faceHalfEdge = he = face.getHalfEdge();
    do {
      vertexIndicies.push( he.getVertex().getIndex() );
      he = he.getNextHalfEdge();
    } while ( he != faceHalfEdge );

    var vlen = vertexIndicies.length;
    if( vlen > 3 ) {
      this.insertEdge( faceIndex, vertexIndicies[ 0 ], vertexIndicies[ 2 ] );
    }
  }
};

Mesh.prototype.insertEdge = function( faceIndex, startVertexIndex, endVertexIndex ) {
  // console.log( 'faceIndex:', faceIndex );
  // console.log( 'startVertexIndex:', startVertexIndex );
  // console.log( 'endVertexIndex:', endVertexIndex );

  if( this.containsEdge( startVertexIndex, endVertexIndex ) ) {
    console.log( 'mesh already contains edge: ', this.getEdgeKeys( startVertexIndex, endVertexIndex ) );
    return;
  }

  var edges = this.edges;
  var halfEdges = this.halfEdges;
  var edgeMap = this.edgeMap;
  var vertices = this.vertices;
  var faces = this.faces;

  var startVertex = vertices[ startVertexIndex ];
  var endVertex = vertices[ endVertexIndex ];

  var halfEdgeA, halfEdgeB, halfEdgeC, halfEdgeD;

  var face = faces[ faceIndex ];
  var faceHalfEdge = face.getHalfEdge();
  var he = faceHalfEdge;
  var hef = he.getFlipHalfEdge();
  do {
    var vertexIndex = he.getVertex().getIndex();
    var vertexIndexNext = hef.getVertex().getIndex();

    if( vertexIndex === startVertexIndex ) {
      halfEdgeA = he;
    }
    if( vertexIndex === endVertexIndex ) {
      halfEdgeC = he;
    }

    if( vertexIndexNext === startVertexIndex ) {
      halfEdgeD = he;
    }
    if( vertexIndexNext === endVertexIndex ) {
      halfEdgeB = he;
    }

    he = he.getNextHalfEdge();
    hef = he.getFlipHalfEdge();
  } while ( he != faceHalfEdge );

  // Set New Edge Properties
  var newEdge = new Edge();
  newEdge.setIndex( edges.length );
  var edgeKeys = this.getEdgeKeys( startVertexIndex, endVertexIndex );
  edgeMap[ edgeKeys[ 0 ] ] = newEdge;
  edgeMap[ edgeKeys[ 1 ] ] = newEdge;
  edges.push( newEdge );

  var newFace = new Face();
  newFace.setIndex( faces.length );
  faces.push( newFace );

  //create new half edges
  var newHalfEdgeAB = new HalfEdge();
  var newHalfEdgeCD = new HalfEdge();

  newHalfEdgeAB.setNextHalfEdge( halfEdgeA );
  newHalfEdgeAB.setFlipHalfEdge( newHalfEdgeCD );
  newHalfEdgeAB.setVertex( endVertex );
  newHalfEdgeAB.setEdge( newEdge );
  newHalfEdgeAB.setFace( face );
  halfEdges.push( newHalfEdgeAB );

  newHalfEdgeCD.setNextHalfEdge( halfEdgeC );
  newHalfEdgeCD.setFlipHalfEdge( newHalfEdgeAB );
  newHalfEdgeCD.setVertex( startVertex );
  newHalfEdgeCD.setEdge( newEdge );
  newHalfEdgeCD.setFace( newFace );
  halfEdges.push( newHalfEdgeCD );

  //set all other edge & halfedge & face properties so they are accurate
  newEdge.setHalfEdge( newHalfEdgeAB );
  face.setHalfEdge( newHalfEdgeAB );
  newFace.setHalfEdge( newHalfEdgeCD );

  halfEdgeD.setNextHalfEdge( newHalfEdgeCD );
  halfEdgeB.setNextHalfEdge( newHalfEdgeAB );
  return newEdge;
};

Mesh.prototype.createVertex = function( edgeIndex, position ) {
  // when you create a new vertex
  // you create a new edge
  // you create two new half edges
  // you create a new vertex
  var edges = this.edges;
  var halfEdges = this.halfEdges;
  var edgeMap = this.edgeMap;
  var vertices = this.vertices;
  var positions = this.positions;

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
};

Mesh.prototype.checkIntegrity = function()
{
  if( !this.checkHalfEdges() ) {
    console.log( 'half edges are messed up' );
    return false;
  }

  if( !this.checkFaces() ) {
    console.log( 'faces are messed up' );
    return false;
  }

  if( !this.checkEdges() ) {
    console.log( 'edges are messed up' );
    return false;
  }

  if( !this.checkVertices() ) {
    console.log( 'vertices are messed up' );
    return false;
  }
  console.log( 'mesh is valid!' );
  return true;
}

Mesh.prototype.checkHalfEdges = function() {
  for( var i = 0; i < this.halfEdges.length; i++ ) {
    var he = this.halfEdges[ i ];
    if( he.getNextHalfEdge() === undefined ) {
      console.log( 'halfEdge: ', i, ' does not have a next half edge' );
      return false;
    }
    if( he.getFlipHalfEdge() === undefined ) {
      console.log( 'halfEdge: ', i, ' does not have a flip half edge' );
      return false;
    }
    if( he.getVertex() === undefined ) {
      console.log( 'halfEdge: ', i, ' does not have a valid vertex' );
      return false;
    }
    if( he.getEdge() === undefined ) {
      console.log( 'halfEdge: ', i, ' does not have an edge' );
      return false;
    }
    if( he.getFace() === undefined ) {
      console.log( 'halfEdge: ', i, ' does not have a face' );
      return false;
    }
  }
  return true;
};

Mesh.prototype.checkFaces = function() {
  for( var i = 0; i < this.faces.length; i++ ) {
    var face = this.faces[ i ];
    if( face.getIndex() === -1 ) {
      console.log('face: ', face.getIndex(), ' does not have a proper index' );
      return false;
    }
    if( face.getHalfEdge() === undefined ) {
      console.log('face: ', face.getIndex(), ' does not have a half edge' );
      return false;
    }
  }
  return true;
};

Mesh.prototype.checkEdges = function() {
  for( var i = 0; i < this.edges.length; i++ ) {
    var edge = this.edges[ i ];
    if( edge.getIndex() === -1 ) {
      console.log('edge: ', edge.getIndex(), ' does not have a proper index' );
      return false;
    }
    if( edge.getHalfEdge() === undefined ) {
      console.log('edge: ', edge.getIndex(), ' does not have a half edge' );
      return false;
    }
  }
  return true;
};

Mesh.prototype.checkVertices = function() {
  for( var i = 0; i < this.vertices.length; i++ ) {
    var vertex = this.vertices[ i ];
    if( vertex .getIndex() === -1 ) {
      console.log('vertex : ', vertex .getIndex(), ' does not have a proper index' );
      return false;
    }
    if( vertex .getHalfEdge() === undefined ) {
      console.log('vertex : ', vertex .getIndex(), ' does not have a half edge' );
      return false;
    }
  }
  return true;
};

module.exports = Mesh;
