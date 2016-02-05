var Edge = require('./../Core/Edge');
var HalfEdge = require('./../Core/HalfEdge');
var Face = require('./../Core/Face');

module.exports = function( mesh, vertices, face ) {
  var meshEdgeMap = mesh.getEdgeMap();
  var meshFaces = mesh.getFaces();
  var meshHalfEdges = mesh.getHalfEdges();
  var meshEdges = mesh.getEdges();

  if( !face ) {
    face = new Face();
    face.setIndex( meshFaces.length );
  }

  var vlen = vertices.length;
  var hel;
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
    if( hel ) {
      hel.setNextHalfEdge( he );
    }

    //v
    v0.setHalfEdge( he );

    hes.push( he );
    hel = he;
    meshHalfEdges.push( he );
  }
  face.setHalfEdge( hes[ 0 ] );
  hel.setNextHalfEdge( hes[ 0 ] );
  return face;
}
