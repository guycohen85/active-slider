export default class ActiveSlider {
    constructor({
        sliderWrapper = '',           //[required] [string] - SLIDER WRAPPER ELEMENT
        elementsActiveClass = '',     //[required] [array OR string]  -  SELECT ELEMENTS TO ADD THE "ACTIVE" CLASS
        swipeArea = '',               //[optional] [string] - SELECT ELEMENT THAT WILL BE THE SWIPE AREA
        clickElementActiveClass = '', //[optional] [array OR string]  -  ON CLICK(bullet,text,etc..) SET ELEMENT AS ACTIVE(not related to prev|next buttons)
        prevNextButtons = [],         //[optional] [array]  -  INSERT PREVIOUS AND NEXT BUTTONS ['.prev', '.next']
        autoSlider = 3500,            //[optional] [number]  -   ACTIVATE AUTOSLIDER , IF 'FALSE' THEN NO AUTOSLIDE - (number=milisecond)
        loop = true                   //[optional] [boolean]  -  LOOP SLIDER(default true)
    }){
        this.$slider = document.querySelector(sliderWrapper);
        this.playSlider;
        this.$prevBtn;
        this.$nextBtn;
        this.$swipeArea = (swipeArea) ? document.querySelector(swipeArea)  : false ;
        this.$slideClickableItems = clickElementActiveClass;
        this.loop = loop;
        this.slideClassName = '';

        this.$slider.setAttribute("data-slide", 1);
        
        //All elements that will be asiggned the "active" class(images,bullets,titles,etc...)
        if( Array.isArray(elementsActiveClass) ){
            this.slideItems = elementsActiveClass.map( slideItem => this.$slider.querySelectorAll( slideItem ));
            this.slideClassName = elementsActiveClass[0];
        }else{
            this.slideItems = this.$slider.querySelectorAll( elementsActiveClass );
            this.slideClassName = elementsActiveClass;
        }
        this.slideCount = this.slideItems[0].length;

        //Set first element as "active" in all slide items(images,bullets,titles,etc...)
        this.setFirstSlideActiveClass();

        //Autoplay
        this.autoSliderTime = autoSlider;
        if(this.autoSliderTime){
            this.autoPlaySlider();
        }

        //Add |prev|next| buttons
        if(prevNextButtons){
            this.addPrevNextButtons(prevNextButtons);
        }

        //Events
        this.buttonsClick();
    }

    addPrevNextButtons(prevNextButtons){
        this.$prevBtn = document.querySelector(prevNextButtons[0]);
        this.$prevBtn.addEventListener('click', () => {
            this.prevSlide();
        });
        this.$nextBtn = document.querySelector(prevNextButtons[1]);
        this.$nextBtn.addEventListener('click', () => {
            this.nextSlide();
        });
    }

    autoPlaySlider(){
        var self = this;
        //Start autoslide
        this.playSlider = setInterval( () => {
            this.nextSlide();
        }, this.autoSliderTime);
        //Stop autoslide
        this.$slider.addEventListener("click", removeAutoSlide);
        this.$slider.addEventListener("touchstart", removeAutoSlide);

        function removeAutoSlide(e){
            self.$slider.removeEventListener(e.type, removeAutoSlide);
            clearInterval(self.playSlider);
        }

    }

    buttonsClick(){
        var self = this;

        // On click(bullet,text,etc..) set element as ACTIVE
        if(this.$slideClickableItems){
            if( Array.isArray(this.$slideClickableItems) ){
                this.$slideClickableItems.forEach(function(items){
                    document.querySelectorAll(items).forEach( el => {
                        el.addEventListener('click', (e) => {
                            self.setSlideActiveClassByClick(e);
                        });
                    });
                });
            }else{
                document.querySelectorAll(this.$slideClickableItems).forEach( el => {
                    el.addEventListener('click', (e) => {
                        self.setSlideActiveClassByClick(e);
                    });
                });
            }
        }
        //touch events
        if(this.$swipeArea){
            this.touchstartX = 0;
            this.$swipeArea.addEventListener('touchstart', function(event) {
                this.touchstartX = event.changedTouches[0].screenX;
            }, false);

            this.$swipeArea.addEventListener('touchend', function(event) {
                var touchendX = event.changedTouches[0].screenX;
                if (touchendX <= this.touchstartX && (this.touchstartX - touchendX) > 25 ) {
                    self.nextSlide();//Swiped left
                }
                
                if (touchendX >= this.touchstartX && (touchendX - this.touchstartX) > 25) {
                    self.prevSlide();//Swiped right
                }
            }, false);
        }
    }

    removeAllActiveClass(){
        this.slideItems.forEach( slideItem => {
            slideItem.forEach(el => {
                el.classList.remove("active");
            });
        });
    }

    setFirstSlideActiveClass(){
        this.removeAllActiveClass();
        this.$slider.dataset.slide = 1;
        this.slideItems.forEach( slideItem => {
            slideItem[0].classList.add("active");
        });
    }

    setLastSlideActiveClass(){
        this.removeAllActiveClass();
        this.$slider.dataset.slide = this.slideCount;
        this.slideItems.forEach( slideItem => {
            slideItem[slideItem.length - 1].classList.add("active");
        });
    }

    setNextSlideActiveClass(){
        this.$slider.dataset.slide = parseInt(this.$slider.dataset.slide) + 1;
        this.slideItems.forEach( slideItem => {

            for (let i = 0; i < this.slideCount; i++) {
                if(slideItem[i].classList.contains('active')){
                    slideItem[i].classList.remove('active');
                    slideItem[i].nextElementSibling.classList.add('active');
                    break;
                }
            }
        });
    }

    setPrevSlideActiveClass(){
        this.$slider.dataset.slide = ( parseInt(this.$slider.dataset.slide) === 1 )? this.slideCount : parseInt(this.$slider.dataset.slide) - 1;
        this.slideItems.forEach( slideItem => {

            for (let i = 0; i < this.slideCount; i++) {
                if(slideItem[i].classList.contains('active')){
                    slideItem[i].classList.remove('active');
                    slideItem[i].previousElementSibling.classList.add('active');
                    break;
                }
            }
        });
    }

    setSlideActiveClassByClick(event){
        var slideIndex = '';
        this.removeAllActiveClass();

        for(let io = 0; io < this.slideCount; io++){
            for (let i = 0; i < this.slideCount; i++) {
                if(event.target.isSameNode( this.slideItems[io][i] )){
                    slideIndex = i;
                    this.$slider.dataset.slide = slideIndex + 1;
                    break;
                }
            }
            if(slideIndex){
                break;
            }
        }

        for(let io = 0; io < this.slideCount; io++){
            this.slideItems[io][slideIndex].classList.add('active');
        }
    }

    nextSlide(){
        var slideLastOfType = this.$slider.querySelector(this.slideClassName + '.active' + ':last-of-type');
        if(slideLastOfType && !this.loop){
            //do nothing
        }else if(slideLastOfType){
            this.setFirstSlideActiveClass();
        }else{
            this.setNextSlideActiveClass();
        }
    }

    prevSlide(){
        var slideFirstOfType = this.$slider.querySelector(this.slideClassName + '.active' + ':first-of-type');
        if(slideFirstOfType && !this.loop){
            //do nothing
        }else if(slideFirstOfType){
            this.setLastSlideActiveClass();
        }else{
            this.setPrevSlideActiveClass();
        }
    }

}

