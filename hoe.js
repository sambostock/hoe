var sift = module.exports.sift = function(keychain, separator) {
  switch(typeof(keychain)) {
    case 'array':
      return keychain.slice() ;
    case 'string':
      return keychain.split(separator || '.') ;
    default:
      return keychain ;
  }
} ;

var dig = module.exports.dig = function(object, keychain, separator) {
  if(typeof(keychain) === 'undefined') { return object ; }
  if(keychain.length === 0) { return object ; }

  var keys = sift(keychain, separator) ;

  while(typeof(keys[0]) !== 'undefined') { // while a key remains
    var key = keys.shift() ;
    if(typeof(object) !== 'undefined') {
      object = object[key] ;
    }
  }

  return object ;
} ;

var bury = module.exports.bury = function(object, value, keychain, separator) {
  if(typeof(keychain) === 'undefined') { return value ; }
  if(keychain.length === 0) { return value ; }
  if(typeof(object) === 'undefined') { object = {} ; }

  var keys = sift(keychain, separator) ;

  var context = object ;

  while(keys.length > 1) { // until we have the object to store the value on
    var key = keys.shift() ;
    nextContext = context[key] ;
    // Create if needed
    if (typeof(nextContext) === 'undefined') { context[key] = {} ; }
    context = nextContext ;
  }

  context[keys.shift()] = value ;

  return object ;
}

var till = module.exports.till = function(object, mapFunction,
    sourceKeychain, destinationKeychain,
    sourceSeparator, destinationSeparator) {
  if(typeof(destinationSeparator) === 'undefined') {
    destinationSeparator = sourceSeparator ;
  }

  var sourceValue = dig(object, sourceKeychain, sourceSeparator) ;

  var value ;
  if (typeof(mapFunction) === 'undefined') {
    value = sourceValue ;
  } else {
    value = mapFunction(sourceValue, object) ;
  }

  return bury(object, value, destinationKeychain, destinationSeparator) ;
}
