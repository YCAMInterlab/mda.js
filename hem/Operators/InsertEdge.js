var Face = require('./../Core/Face');
var Edge = require('./../Core/Edge');
var HalfEdge = require('./../Core/HalfEdge');

module.exports = function( mesh, faceIndex, startVertexIndex, endVertexIndex ) {
  // console.log( 'faceIndex:', faceIndex );
  // console.log( 'startVertexIndex:', startVertexIndex );
  // console.log( 'endVertexIndex:', endVertexIndex );

  if( startVertexIndex === endVertexIndex ) {
    throw 'illegal edge inseration: ' + startVertexIndex + ' , ' + endVertexIndex;
  }

  var edges = mesh.getEdges();
  var halfEdges = mesh.getHalfEdges();
  var edgeMap = mesh.getEdgeMap();
  var vertices = mesh.getVertices();
  var faces = mesh.getFaces();
  var edge = mesh.getEdge( startVertexIndex, endVertexIndex );

  if( edge ) {
    // console.log( 'mesh already contains edge: ', mesh.getEdgeKeys( startVertexIndex, endVertexIndex ) );
    return { edge: edge, face: faces[ faceIndex ] };
  }

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


  if( halfEdgeA === undefined || halfEdgeB === undefined ||
      halfEdgeC === undefined || halfEdgeD === undefined ) {
        throw 'error finding neighboring half edges when inserting edge';
      }

  // Set New Edge Properties
  var newEdge = new Edge();
  newEdge.setIndex( edges.length );
  var edgeKeys = mesh.getEdgeKeys( startVertexIndex, endVertexIndex );
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
  return { edge: newEdge, face: newFace };
};
