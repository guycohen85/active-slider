# Active Slider
Slider for CSS masters.

Active-Slider:
- Will add an "active" class  for your desired HTML tags.
- The "active" class can be activated by an auto slide, prev-next buttons or element click.
- Will not create Html tags or any other sort of Css or Js animation.

There is one rule, slides group must have the same number of elements.
For example: slide-images must have the same number of elements as the bullets.

Finaly, as a CSS master, it will be your responsibilty to add your animation or what ever you need to do with the active elements.


## NPM

```
npm install active-slider
```

```javascript
import ActiveSlider from 'active-slider';

new ActiveSlider({
    sliderWrapper: '.slider-wrapper', 
    activeElements: ['.slide-image', '.bullet'],
}); 

```

## Parameters
- sliderWrapper
(string)(required) - Select the slider wrapper element.
example: '.slider'
    
- activeElements
(array|string)(required) - Select elements to add the active class.
example: ['.slide-image', '.bullet']
    
- swipeArea
(string)(optional) - Select the element that will be the swipe area.
example: '.slide-images-container'

- clickableElements
(array|string)(optional) -  Add the active class to the clicked slide.
example: '.bullet'

- prevNextButtons
(array)(optional) - Select the previous and next buttons.
example: ['.prev', '.next']

- autoSlide
(number|boolean)(optional)  - Default time between slides is 3500 milliseconds. set to false if no need an auto slide.
default: 3500

- stopAutoSlideOnClick
(array)(optional) - Select the elements to be the listeners for the click event in order to stop the auto slide.
example: ['.prev', '.next']

- loop
(boolean)(optional) - Loop slider.
default: true

