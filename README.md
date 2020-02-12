# Active Slider
Slider for CSS masters.

Active-Slider:
- Will add an "active" class  for your desired HTML tags.
- The "active" class can be activated by an auto slide, prev-next buttons or item click.
- Will not create Html tags or any other sort of Css or Js animation.

Finaly, as a CSS master, it will be your responsibilty to add your animation or what ever you need to do with the active elements.

## NPM

```
npm install active-slider
```

```javascript
import ActiveSlider from 'active-slider';

new ActiveSlider({
    //[required][string] - SELECT THE SLIDER WRAPPER ELEMENT
    sliderWrapper: '.slider-wrapper', 

    //[required][array OR string] - SELECT ELEMENTS TO ADD THE "ACTIVE" CLASS
    elementsActiveClass: ['.slide-image', '.bullet', '.slide-text'],

    //[optional][string] - SELECT ELEMENT THAT WILL BE THE SWIPE AREA
    swipeArea: '.slide-images',

    //[optional] [array OR string]  -  ON CLICK(bullet,text,etc..) SET ELEMENT AS ACTIVE(not related to prev|next buttons)
    clickElementActiveClass: '.slide-image',

    //[optional] [array] - PREVIOUS AND NEXT BUTTONS ['.prev', '.next']
    prevNextButtons: ['.prev', '.next'],         

    //[optional] [number] ACTIVATE AUTOSLIDER IN MILLISECONDS
    autoSlider: 3500,
    
    //[optional] [boolean]  -  LOOP SLIDER(default true)
    loop: true                   
}); 

```

