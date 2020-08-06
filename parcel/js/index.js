//  CommonJS (i.e. NodeJS syntax)
// const joke = require('./jokes')

// ES2016
import {joke} from './jokes';

joke.getOne()
  .then(joke => {
      document.getElementById('joke').innerHTML = joke
  })


// Read file
import textFile from './textFile.js'
document.getElementById('text').innerHTML = textFile
