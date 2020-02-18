class ActiveElements {
    constructor({
        wrapper = '', //(string)(required) - Select the wrapper element. example: '.slider'
        activeElements = '', //(array|string)(required) - Select elements to add the active class. example: ['.slide-image', '.bullet']
        swipeArea = '', //(string)(optional) - Select the element that will be the swipe area. example: '.slide-images-container'
        clickableElements = '', //(array|string)(optional) - Add the active class to the clicked element. example: '.bullet'
        prevNextButtons = false, //(array)(optional) - Select the previous and next buttons. example: ['.prev', '.next']
        autoPlay = 3500, //(number|boolean)(optional) - Default duration is 3500 milliseconds. set to false if no need for autoplay. default: 3500
        stopAutoPlayOnClick = false, //(string|array)(optional) - Select the elements to be the listeners for the click event in order to stop the autoplay. example: ['.prev', '.next']
        loop = true, //(boolean)(optional) - Loop elements. default: true
        firstElementActive = true //(boolean)(optional) - Set to false in order to remove the active class from the first elements as default
    }) {
        this.wrapper = document.querySelector(wrapper);
        this.autoPlaySpeed;
        this.prevBtn;
        this.nextBtn;
        this.swipeArea = (swipeArea) ? document.querySelector(swipeArea) : false;
        this.clickableElements = clickableElements;
        this.stopAutoPlayOnClick = stopAutoPlayOnClick;
        this.loop = loop;
        this.elementClassName = '';

        

        //All elements that will be asiggned the "active" class(images,bullets,titles,etc...)
        if (Array.isArray(activeElements)) {
            this.activeElements = activeElements.map(el => this.wrapper.querySelectorAll(el));
            this.elementClassName = activeElements[0];
        } else {
            this.activeElements = [this.wrapper.querySelectorAll(activeElements)];
            this.elementClassName = activeElements;
        }
        this.elementsGroupCount = this.activeElements.length;
        this.elementsCount = this.activeElements[0].length;

        //Set first element as "active" in all slide items(images,bullets,titles,etc...)
        if(firstElementActive){
            this.wrapper.setAttribute("data-slide", 1);
            this.firstSlideActive();
        }

        //Autoplay
        this.autoPlaySpeed = autoPlay;
        if (this.autoPlaySpeed) {
            this.startAutoPlay();
        }

        //Add |prev|next| buttons
        if (prevNextButtons) {
            this._addPrevNextButtons(prevNextButtons);
        }

        //Events
        this._clickEvent();
        this._swipeEvent();
    }

    _addPrevNextButtons(prevNextButtons) {
        this.prevBtn = document.querySelector(prevNextButtons[0]);
        this.prevBtn.addEventListener('click', () => {
            this.prevSlide();
        });
        this.nextBtn = document.querySelector(prevNextButtons[1]);
        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
        });
    }

    startAutoPlay() {  
        this.playSlider = setInterval(() => {
            this.nextSlide();
        }, this.autoPlaySpeed);
        
        if(this.stopAutoPlayOnClick){
            this.stopAutoPlayOnClick = Array.isArray(this.stopAutoPlayOnClick) ? this.stopAutoPlayOnClick : [this.stopAutoPlayOnClick];
            for (let io = 0; io < this.stopAutoPlayOnClick.length; io++) {
                var elements = document.querySelectorAll(this.stopAutoPlayOnClick[io]);
                for (let i = 0; i < elements.length; i++) {
                    elements[i].addEventListener("click", e => this.stopAutoPlay(e), {once : true} );
                    elements[i].addEventListener("touchstart", e => this.stopAutoPlay(e), {once : true} );
                }
            }
        }
    }

    stopAutoPlay(e){
        clearInterval(this.playSlider);
    }

    _clickEvent(){
        if (this.clickableElements) {
            if (Array.isArray(this.clickableElements)) {
                this.clickableElements.forEach(function (items) {
                    document.querySelectorAll(items).forEach(el => {
                        el.addEventListener('click', (e) => {
                            this._setSlideActiveClassByClick(e);
                        });
                    });
                });
            } else {
                document.querySelectorAll(this.clickableElements).forEach(el => {
                    el.addEventListener('click', (e) => {
                        this._setSlideActiveClassByClick(e);
                    });
                });
            }
        }
    }

    _swipeEvent(){
        if (this.swipeArea) {
            this.touchstartX = 0;
            this.swipeArea.addEventListener('touchstart', function (event) {
                this.touchstartX = event.changedTouches[0].screenX;
            }, false);

            this.swipeArea.addEventListener('touchend', function (event) {
                var touchendX = event.changedTouches[0].screenX;
                if (touchendX <= this.touchstartX && (this.touchstartX - touchendX) > 25) {
                    self.nextSlide(); //Swiped left
                }

                if (touchendX >= this.touchstartX && (touchendX - this.touchstartX) > 25) {
                    self.prevSlide(); //Swiped right
                }
            }, false);
        }
    }

    removeAllActiveClass() {
        this.activeElements.forEach(slideItem => {
            slideItem.forEach(el => {
                el.classList.remove("active");
            });
        });
    }

    firstSlideActive() {
        this.removeAllActiveClass();
        this.wrapper.dataset.slide = 1;
        this.activeElements.forEach(slideItem => {
            slideItem[0].classList.add("active");
        });
    }

    lastSlideActive() {
        this.removeAllActiveClass();
        this.wrapper.dataset.slide = this.elementsCount;
        this.activeElements.forEach(slideItem => {
            slideItem[slideItem.length - 1].classList.add("active");
        });
    }

    _setNextSlideActiveClass() {
        this.wrapper.dataset.slide = parseInt(this.wrapper.dataset.slide) + 1;
        this.activeElements.forEach(slideItem => {

            for (let i = 0; i < this.elementsCount; i++) {
                if (slideItem[i].classList.contains('active')) {
                    slideItem[i].classList.remove('active');
                    slideItem[i].nextElementSibling.classList.add('active');
                    break;
                }
            }
        });
    }

    _setPrevSlideActiveClass() {
        this.wrapper.dataset.slide = (parseInt(this.wrapper.dataset.slide) === 1) ? this.elementsCount : parseInt(this.wrapper.dataset.slide) - 1;
        this.activeElements.forEach(slideItem => {

            for (let i = 0; i < this.elementsCount; i++) {
                if (slideItem[i].classList.contains('active')) {
                    slideItem[i].classList.remove('active');
                    slideItem[i].previousElementSibling.classList.add('active');
                    break;
                }
            }
        });
    }

    _setSlideActiveClassByClick(event) {
        var slideIndex = '';
        this.removeAllActiveClass();

        for (let io = 0; io < this.elementsGroupCount; io++) {
            for (let i = 0; i < this.elementsCount; i++) {
                if (event.currentTarget.isSameNode(this.activeElements[io][i])) {
                    slideIndex = i;
                    this.wrapper.dataset.slide = slideIndex + 1;
                    break;
                }
            }
            if (slideIndex) {
                break;
            }
        }

        for (let io = 0; io < this.elementsGroupCount; io++) {
            this.activeElements[io][slideIndex].classList.add('active');
        }
    }

    nextSlide() {
        var slideLastOfType = this.wrapper.querySelector(this.elementClassName + '.active' + ':last-of-type');
        if (slideLastOfType && !this.loop) {
            //do nothing
        } else if (slideLastOfType) {
            this.firstSlideActive();
        } else {
            this._setNextSlideActiveClass();
        }
    }

    prevSlide() {
        var slideFirstOfType = this.wrapper.querySelector(this.elementClassName + '.active' + ':first-of-type');
        if (slideFirstOfType && !this.loop) {
            //do nothing
        } else if (slideFirstOfType) {
            this.lastSlideActive();
        } else {
            this._setPrevSlideActiveClass();
        }
    }

}
