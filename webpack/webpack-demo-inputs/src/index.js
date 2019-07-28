import _ from 'lodash';
import './style.css';

// data examples
import Bench from './bench.jpg'
import Data from './centroids.json'


function component() {
    
    const element = document.createElement('div');
  
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello')
  
    // Add the image to our existing div
    const myImage = new Image();
    myImage.src = Bench;
    element.appendChild(myImage);

    console.log(Data)
 
    return element;
  }
  
  document.body.appendChild(component());