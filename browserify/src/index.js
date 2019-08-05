var _ = require('lodash');
var $ = require('jquery')

_([1,2,3,6,7,3,6,3,5,7,9,6,8,5])
  .uniq()
  .each(function(i){
      console.log(i)
  })