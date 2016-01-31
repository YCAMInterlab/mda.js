var Vertex = require('./../Core/Vertex');
var Edge = require('./../Core/Edge');
var HalfEdge = require('./../Core/HalfEdge');
var Face = require('./../Core/Face');

var FaceHalfEdges = require('./../Queries/FaceHalfEdges');
var MeshCentroid = require('./../Queries/MeshCentroid');
var vec3 = require('gl-matrix').vec3;
var quat = require('gl-matrix').quat;
var calculateNormal = require('guf').calculateNormal;
var expandPolygon = require('cga').expandPolygon2;

var vec3 = require('gl-matrix').vec3;

var zAxis = vec3.fromValues( 0.0, 0.0, 1.0 );

module.exports = function( mesh, faceIndex, distance, scale ) {
  var meshVerts = mesh.getVertices();
  var meshHalfEdges = mesh.getHalfEdges();
  var meshEdges = mesh.getEdges();
  var meshEdgeMap = mesh.getEdgeMap();
  var meshFaces = mesh.getFaces();
  var meshPositions = mesh.positions;

  var originalFace = meshFaces[ faceIndex ];
  var faceHalfEdges = FaceHalfEdges( originalFace );
  var flen = faceHalfEdges.length;
  var originalVertices = [];
  var center = vec3.create();
  for( var i = 0; i < flen; i++ ) {
    var he = faceHalfEdges[ i ];
    var vertex = he.getVertex();
    var vertexIndex = vertex.getIndex();
    originalVertices.push( vertex );
  }

  var vlen = originalVertices.length;
  var v0 = meshPositions[ originalVertices[ 0 ].getIndex() ];
  var v1 = meshPositions[ originalVertices[ 1 ].getIndex() ];
  var v2 = meshPositions[ originalVertices[ 2 ].getIndex() ];

  var normal = calculateNormal( v0, v1, v2 );
  var faceOri = quat.create();
  quat.rotationTo( faceOri, normal, zAxis );

  var newVertices = [];
  var polygon = [];
  var indicies = [];
  var zOffset = 0.0;
  for( var j = 0; j < vlen; j++ ) {
    var vertex = originalVertices[ j ];
    var vertexIndex = vertex.getIndex();
    var vertexPos = vec3.clone( meshPositions[ vertexIndex ] );
    vec3.transformQuat( vertexPos, vertexPos, faceOri );
    zOffset = vertexPos[ 2 ];
    polygon.push( [ vertexPos[ 0 ], vertexPos[ 1 ] ] );
    indicies.push( vertexIndex );
    newVertices.push( new Vertex() );
  }
  // console.log( zOffset );

  quat.rotationTo( faceOri, zAxis, normal );

  var results = expandPolygon( polygon, - ( scale != undefined ? scale : 0.0 ) );
  var rlen = results.length;
  var newPositions = [];
  var newEdges = [];
  var newHalfEdges = [];


  zOffset += ( distance != undefined ? distance : 0.0 );  

  for( var i = 0; i < rlen; i++ ) {
    var pos = results[ i ];
    var vpos = vec3.fromValues( pos[ 0 ], pos[ 1 ], zOffset );
    vec3.transformQuat( vpos, vpos, faceOri );
    // vec3.add( vpos, vpos, [0,0,zOffset]);
    newPositions.push( vpos );
    var vertex = newVertices[ i ];
    vertex.setIndex( meshPositions.length );
    meshPositions.push( vpos );
    meshVerts.push( vertex );
  }

  var lhe = undefined;
  var lhef = undefined;
  for( var i = 0; i < rlen; i++ ) {
    var f = originalFace;
    var v = newVertices[ i ];
    var vn = newVertices[ ( i + 1 ) % rlen ];

    var e = new Edge();
    var he = new HalfEdge();
    var hef = new HalfEdge();

    //he
    he.setFlipHalfEdge( hef );
    he.setEdge( e );
    he.setVertex( v );
    he.setFace( f );
    meshHalfEdges.push( he );
    //hef
    hef.setFlipHalfEdge( he );
    hef.setEdge( e );
    hef.setVertex( vn );
    meshHalfEdges.push( hef );

    //e
    e.setIndex( meshEdges.length );
    e.setHalfEdge( he );
    meshEdges.push( e );
    var keys = mesh.getEdgeKeys( v.getIndex(), vn.getIndex() );
    meshEdgeMap[ keys[ 0 ] ] = e;
    meshEdgeMap[ keys[ 1 ] ] = e;

    //v
    v.setHalfEdge( he );
    newEdges.push( e );
    newHalfEdges.push( he );

    if( lhe ) {
      lhe.setNextHalfEdge( he );
      hef.setNextHalfEdge( lhef );
    }
    lhe = he;
    lhef = hef;
  }

  var he = newHalfEdges[ 0 ];
  var hef = he.getFlipHalfEdge();
  lhe.setNextHalfEdge( he );
  hef.setNextHalfEdge( lhef );
  originalFace.setHalfEdge( he );

  var newFaces = [];
  var holeHalfEdges = [];
  var lf = undefined;
  var lhe = undefined;

  for( var i = 0; i < rlen; i++ ) {
    var v = newVertices[ i ];
    var vo = originalVertices[ i ];
    var heo = v.getHalfEdge();
    var heof = heo.getFlipHalfEdge();

    var ofhe = faceHalfEdges[ i ];
    var li = i - 1;
    li = li < 0 ? rlen + li : li;
    var ofhep = faceHalfEdges[ li ];

    var f = new Face();
    var e = new Edge();
    var he = new HalfEdge();
    var hef = new HalfEdge();

    //he
    he.setFlipHalfEdge( hef );
    he.setNextHalfEdge( ofhe );
    he.setEdge( e );
    he.setVertex( v );
    he.setFace( f );

    //hef
    hef.setFlipHalfEdge( he );
    hef.setNextHalfEdge( heof.getNextHalfEdge() );
    hef.setEdge( e );
    hef.setVertex( vo );
    hef.setFace( lf );

    //e
    e.setIndex( meshEdges.length );
    meshEdges.push( e );
    e.setHalfEdge( he );

    //f
    f.setIndex( meshFaces.length );
    f.setHalfEdge( he );
    meshFaces.push( f );
    newFaces.push( f );

    //vo
    vo.setHalfEdge( hef );

    //old connections
    heof.setNextHalfEdge( he );
    heof.setFace( f );
    ofhe.setFace( f );
    ofhep.setNextHalfEdge( hef );

    holeHalfEdges.push( he );
    lf = f;
  }

  var he = holeHalfEdges[ 0 ];
  var hef = he.getFlipHalfEdge();
  hef.setFace( newFaces[ newFaces.length - 1 ] );




  // //didn't work for more than 1
  // for( var i = 0; i < rlen; i++ ) {
  //   var vn0 = newVertices[ i ];
  //   var vn1 = newVertices[ ( i + 1 ) % rlen ];
  //
  //   var vo0 = originalVertices[ i ];
  //   var vo1 = originalVertices[ ( i + 1 ) % rlen ];
  //
  //   meshFaces.push( createFace( mesh, [ vo0, vo1, vn1, vn0 ] ) );
  // }

  return originalFace;
};

function createFace( mesh, vertices, face ) {
  var meshEdgeMap = mesh.getEdgeMap();
  var meshFaces = mesh.getFaces();
  var meshHalfEdges = mesh.getHalfEdges();
  var meshEdges = mesh.getEdges();

  if( !face ) {
    face = new Face();
    face.setIndex( meshFaces.length );
  }

  var vlen = vertices.length;
  var lhe;
  var hes = [];
  for( var i = 0; i < vlen; i++ ) {
    var v0 = vertices[ i ];
    var v1 = vertices[ ( i + 1 ) % vlen ];
    var i0 = v0.getIndex();
    var i1 = v1.getIndex();

    var he = new HalfEdge();
    var edge = mesh.getEdge( i0, i1 );
    if( edge ) {
      var het = edge.getHalfEdge();
      var hetv = het.getVertex();
      if( hetv == v0 ) {
        he = het;
      }
      else {
        he.setFlipHalfEdge( het );
        het.setFlipHalfEdge( he );
      }
    }
    else {
      edge = new Edge();
      var keys = mesh.getEdgeKeys( i0, i1 );
      edge.setIndex( meshEdges.length );
      meshEdges.push( edge );
      edge.setHalfEdge( he );
      meshEdgeMap[ keys[ 0 ] ] = edge;
      meshEdgeMap[ keys[ 1 ] ] = edge;
    }

    //he
    he.setEdge( edge );
    he.setFace( face );
    he.setVertex( v0 );
    if( lhe ) {
      lhe.setNextHalfEdge( he );
    }
    hes.push( he );
    lhe = he;
    meshHalfEdges.push( he );
  }
  face.setHalfEdge( lhe );
  lhe.setNextHalfEdge( hes[ 0 ] );
  return face;
}
