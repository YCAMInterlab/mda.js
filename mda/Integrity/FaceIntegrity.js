module.exports = function( face ) {
  var passed = true;
  if( face.getIndex() === -1 ) {
    console.log('face: ', face.getIndex(), ' does not have a proper index' );
    passed = false;
  }
  if( face.getHalfEdge() === undefined ) {
    console.log('face: ', face.getIndex(), ' does not have a half edge' );
    passed = false;
  }
  return passed;
};
