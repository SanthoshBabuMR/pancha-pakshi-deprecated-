define( [ "moment", "underscore" ], function( moment, _  ) {

var util = {};

/**
 * @method padZero
 * @description prepend zero to numbers less than 10 eg: 08
 * @return {number|string}
 */
util.padZero = function( n ) {
  return window.parseInt( n ) < 10 ? "0" + window.parseInt( n ) : n;
};

/**
 * @method moveToFirst
 * @description return a new array such that the starting index contains "val". eg: arr=["a","b","c","d"], val="c" => ["c","d","a","b"]
 * @param {array} arr array containing lowerbound and upperbound
 * @param {number} val a numeric value
 * @return {array|error}
 */
util.moveToFirst = function( arr, val ) {
  if ( _.isArray(arr) === true ) {
    var newArr = [];
    var len = arr.length;
    var index = _.indexOf(arr, val);
    //console.log( "index : " + index);
    //console.log( val );
    for (var i = 0, j = index; i < len; i++, j++) {
      j = j >= len ? 0 : j;
      newArr[i] = arr[j];
    }
    return newArr;
  } else {
    throw Error("first argument must be array");
  }
};

util.captializeFirstChar = function( word ) {
  return word.replace( /^./ , function( character ) {
      return character.toUpperCase()
  } );
}


return util;

});

