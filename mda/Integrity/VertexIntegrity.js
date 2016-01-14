module.exports = function( vertex ) {
  var passed = true;
  if( vertex.getIndex() === -1 ) {
    console.log('vertex : ', vertex.getIndex(), ' does not have a proper index' );
    passed = false;
  }
  if( vertex.getHalfEdge() === undefined ) {
    console.log('vertex : ', vertex.getIndex(), ' does not have a half edge' );
    passed = false;
  }
  return passed;
};
