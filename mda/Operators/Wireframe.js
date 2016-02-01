var Vertex = require('./../Core/Vertex');
var FaceHalfEdges = require('./../Queries/FaceHalfEdges');
var FaceVertices = require('./../Queries/FaceVertices');
var VertexHalfEdges = require('./../Queries/VertexHalfEdges');
var CreateFace = require('./CreateFace');
var Cross = require('guf').cross;
var CalculateNormal = require('guf').calculateNormal;
var ExpandPolygon = require('cga').expandPolygon2;

var vec3 = require('gl-matrix').vec3;
var quat = require('gl-matrix').quat;

var tmp = vec3.create();
var tmp2 = vec3.create();
var p0p1 = vec3.create();
var p2p1 = vec3.create();

var zAxis = vec3.fromValues( 0.0, 0.0, 1.0 );

module.exports = function( mesh, offset, depth ) {
  var meshPositions = mesh.positions;
  var meshVertices = mesh.getVertices();
  var mvlen = meshVertices.length;

  var meshFaces = mesh.getFaces();
  var mflen = meshFaces.length;

  offset = offset != undefined ? offset : 1.0;
  depth = depth != undefined ? depth : offset;

  for( var i = 0; i < mvlen; i++ ) {
    var vertex = meshVertices[ i ];
    var vertexPosition = meshPositions[ vertex.getIndex() ];
    var vertexHalfEdges = VertexHalfEdges( vertex );
    var hlen = vertexHalfEdges.length;
    vec3.set( tmp, 0, 0, 0 );
    for( var j = 0; j < hlen; j++ ) {
      var h0 = vertexHalfEdges[ j ];
      var h1 = vertexHalfEdges[ ( j + 1 ) % hlen ];

      var h0n = h0.getNextHalfEdge();
      var h1n = h1.getNextHalfEdge();

      var v0 = h0n.getVertex();
      var v1 = h1n.getVertex();

      var p0 = meshPositions[ v0.getIndex() ];
      var p1 = meshPositions[ v1.getIndex() ];

      Cross( tmp2, p0, vertexPosition, p1 );
      vec3.add( tmp, tmp, tmp2 );
    }

    vec3.normalize( tmp, tmp );
    vec3.scale( tmp, tmp, depth );
    var newPosition = vec3.create();
    vec3.add( newPosition, vertexPosition, tmp );

    var vertex = new Vertex();
    vertex.setIndex( meshVertices.length );
    meshVertices.push( vertex );
    meshPositions.push( newPosition );
  }

  for( var k = 0; k < mflen; k++ ) {
    var face = meshFaces[ k ];
    var faceVertices = FaceVertices( face );
    var vlen = faceVertices.length;
    var v0 = meshPositions[ faceVertices[ 0 ].getIndex() ];
    var v1 = meshPositions[ faceVertices[ 1 ].getIndex() ];
    var v2 = meshPositions[ faceVertices[ 2 ].getIndex() ];

    var normal = CalculateNormal( v0, v1, v2 );
    var faceOri = quat.create();
    quat.rotationTo( faceOri, normal, zAxis );

    var newFaceVertices = [];
    var polygon = [];
    var zOffset = 0.0;
    for( var j = 0; j < vlen; j++ ) {
      var vertex = faceVertices[ j ];
      var vertexIndex = vertex.getIndex();
      var vertexPos = vec3.clone( meshPositions[ vertexIndex ] );
      vec3.transformQuat( vertexPos, vertexPos, faceOri );
      zOffset = vertexPos[ 2 ];
      polygon.push( [ vertexPos[ 0 ], vertexPos[ 1 ] ] );
      newFaceVertices.push( new Vertex() );
    }

    quat.rotationTo( faceOri, zAxis, normal );

    var results = ExpandPolygon( polygon, - offset );
    var rlen = results.length;

    for( var i = 0; i < rlen; i++ ) {
      var pos = results[ i ];
      var vpos = vec3.fromValues( pos[ 0 ], pos[ 1 ], zOffset );
      vec3.transformQuat( vpos, vpos, faceOri );
      var vertex = newFaceVertices[ i ];
      vertex.setIndex( meshVertices.length );
      meshPositions.push( vpos );
      meshVertices.push( vertex );
    }

    var faces = [ face ];
    for( var i = 0; i < vlen; i++ ) {
      var i0 = i;
      var i1 = ( i + 1 ) % vlen;
      var v0 = faceVertices[ i0 ];
      var v1 = faceVertices[ i1 ];

      var v0e = meshVertices[ v0.getIndex() + mvlen ];
      var v1e = meshVertices[ v1.getIndex() + mvlen ];

      var v2 = newFaceVertices[ i1 ];
      var v3 = newFaceVertices[ i0 ];

      var f = faces[ i ];
      var add = f == undefined ? true : false;
      var result = CreateFace( mesh, [ v0, v1, v2, v3 ], f );
      if( add ) {
        meshFaces.push( result );
      }
      meshFaces.push( CreateFace( mesh, [ v0e, v3, v2, v1e ] ) );
    }
  }
};
