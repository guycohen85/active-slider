# Active Elements
Library for CSS masters.
Build whatever you need with the active class.

- **The Active Class** - Active-Elements has one job, adding an "active" class for your desired HTML tags.
- **Keep your HTML beautiful** - Active Elements will not inject HTML, CSS or JS code.
- **Full control** - As a CSS master, you'll have full control over your markup with no injected Html or Css.

There is one rule, active-elements group must have the same number of elements.
For example: slide-images must have the same number of bullets elements.


## NPM

```
npm install active-elements
```

```javascript
import ActiveElements from 'active-elements';

new ActiveElements({
    wrapper: '.slider-wrapper', 
    activeElements: ['.slide-image', '.bullet'],
}); 

```

## Parameters
- wrapper
(string)(required) - Select the wrapper element.
Example: '.slider'
    
- activeElements
(array|string)(required) - Select elements to add the active class.
Example: ['.slide-image', '.bullet']
    
- swipeArea
(string)(optional) - Select the element that will be the swipe area.
Example: '.slide-images-container'

- clickableElements
(array|string)(optional) -  Add the active class to the clicked element.
Example: '.bullet'

- prevNextButtons
(array)(optional) - Select the previous and next buttons.
Example: ['.prev', '.next']

- autoplay
(boolean)(optional) - Is autoplay.
Default: true

- autoplaySpeed
(number)(optional) - Autoplay duration in milliseconds.
Default: 3500

- stopAutoPlayOnClick
(string|array)(optional) - Select the elements to be the listeners for the click event in order to stop the autoplay.
Example: ['.prev', '.next']

- loop
(boolean)(optional) - Loop elements.
Default: true

- firstElementActive
(boolean)(optional) - Set to false in order to remove the active class from the first elements as default.
Default: true

## Methods

Get more control with the object methods.

```javascript
import ActiveElements from 'active-elements';

var mySlider = new ActiveElements({
    wrapper: '.slider-wrapper', 
    activeElements: ['.slide-image', '.bullet'],
}); 

// Set the first element as active
mySlider.firstElementActive();

// Set the last element as active
mySlider.lastElementActive();

// Set the next element as active
mySlider.nextElement();

// Set the previous element as active
mySlider.prevElement();

// Remove the active Class from all elements
mySlider.removeAllActiveClass();

// Start autoplay
mySlider.startAutoplay();

// stop autoplay
mySlider.stopAutoplay();

```

## Examples

Slider - https://codepen.io/guycohen85/pen/GRJoxvw

Cards - https://codepen.io/guycohen85/pen/YzXqOPJ

Rubik's Cube - https://codepen.io/guycohen85/pen/MWwjwKO


