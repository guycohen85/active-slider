class ActiveSlider {
    constructor({
        sliderWrapper = '', //(string)(required) - Select the slider wrapper element. example: '.slider'
        activeElements = '', //(array|string)(required) - Select elements to add the active class. example: ['.slide-image', '.bullet']
        swipeArea = '', //(string)(optional) - Select the element that will be the swipe area. example: '.slide-images-container'
        clickableElements = '', //(array|string)(optional) - Add the active class to the clicked slide. example: '.bullet'
        prevNextButtons = false, //(array)(optional) - Select the previous and next buttons. example: ['.prev', '.next']
        autoSlide = 3500, //(number|boolean)(optional) - Default time between slides is 3500 milliseconds. set to false if no need an auto slide. default: 3500
        stopAutoSlideOnClick = false, //(array)(optional) - Select the elements to be the listeners for the click event in order to stop the auto slide. example: ['.prev', '.next']
        loop = true, //(boolean)(optional) - Loop slider. default: true
        activeFirstSlide = true
    }) {
        this.$slider = document.querySelector(sliderWrapper);
        this.playSlider;
        this.$prevBtn;
        this.$nextBtn;
        this.$swipeArea = (swipeArea) ? document.querySelector(swipeArea) : false;
        this.clickableElements = clickableElements;
        this.stopAutoSlideOnClick = stopAutoSlideOnClick;
        this.loop = loop;
        this.slideClassName = '';

        

        //All elements that will be asiggned the "active" class(images,bullets,titles,etc...)
        if (Array.isArray(activeElements)) {
            this.slideItems = activeElements.map(slideItem => this.$slider.querySelectorAll(slideItem));
            this.slideClassName = activeElements[0];
        } else {
            this.slideItems = [this.$slider.querySelectorAll(activeElements)];
            this.slideClassName = activeElements;
        }
        this.slideGroupCount = this.slideItems.length;
        this.slideCount = this.slideItems[0].length;

        //Set first element as "active" in all slide items(images,bullets,titles,etc...)
        if(activeFirstSlide){
            this.$slider.setAttribute("data-slide", 1);
            this.setFirstSlideActiveClass();
        }

        //Autoplay
        this.autoSliderTime = autoSlide;
        if (this.autoSliderTime) {
            this.autoPlaySlider();
        }

        //Add |prev|next| buttons
        if (prevNextButtons) {
            this.addPrevNextButtons(prevNextButtons);
        }

        //Events
        this.buttonsClick();
    }

    addPrevNextButtons(prevNextButtons) {
        this.$prevBtn = document.querySelector(prevNextButtons[0]);
        this.$prevBtn.addEventListener('click', () => {
            this.prevSlide();
        });
        this.$nextBtn = document.querySelector(prevNextButtons[1]);
        this.$nextBtn.addEventListener('click', () => {
            this.nextSlide();
        });
    }

    autoPlaySlider() {
        var self = this;
        
        //Start autoslide
        this.playSlider = setInterval(() => {
            this.nextSlide();
        }, this.autoSliderTime);

        //Stop autoslide
        if(this.stopAutoSlideOnClick){
            for (let io = 0; io < this.stopAutoSlideOnClick.length; io++) {
                var elements = document.querySelectorAll(this.stopAutoSlideOnClick[io]);
                for (let i = 0; i < elements.length; i++) {
                    elements[i].addEventListener("click", removeAutoSlide);
                    elements[i].addEventListener("touchstart", removeAutoSlide);
                }
            }
        }

        function removeAutoSlide(e) {
            self.$slider.removeEventListener(e.type, removeAutoSlide);
            clearInterval(self.playSlider);
        }
    }

    buttonsClick() {
        var self = this;

        // On click(bullet,text,etc..) set element as ACTIVE
        if (this.clickableElements) {
            if (Array.isArray(this.clickableElements)) {
                this.clickableElements.forEach(function (items) {
                    document.querySelectorAll(items).forEach(el => {
                        el.addEventListener('click', (e) => {
                            self.setSlideActiveClassByClick(e);
                        });
                    });
                });
            } else {
                document.querySelectorAll(this.clickableElements).forEach(el => {
                    el.addEventListener('click', (e) => {
                        self.setSlideActiveClassByClick(e);
                    });
                });
            }
        }
        //touch events
        if (this.$swipeArea) {
            this.touchstartX = 0;
            this.$swipeArea.addEventListener('touchstart', function (event) {
                this.touchstartX = event.changedTouches[0].screenX;
            }, false);

            this.$swipeArea.addEventListener('touchend', function (event) {
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
        this.slideItems.forEach(slideItem => {
            slideItem.forEach(el => {
                el.classList.remove("active");
            });
        });
    }

    setFirstSlideActiveClass() {
        this.removeAllActiveClass();
        this.$slider.dataset.slide = 1;
        this.slideItems.forEach(slideItem => {
            slideItem[0].classList.add("active");
        });
    }

    setLastSlideActiveClass() {
        this.removeAllActiveClass();
        this.$slider.dataset.slide = this.slideCount;
        this.slideItems.forEach(slideItem => {
            slideItem[slideItem.length - 1].classList.add("active");
        });
    }

    setNextSlideActiveClass() {
        this.$slider.dataset.slide = parseInt(this.$slider.dataset.slide) + 1;
        this.slideItems.forEach(slideItem => {

            for (let i = 0; i < this.slideCount; i++) {
                if (slideItem[i].classList.contains('active')) {
                    slideItem[i].classList.remove('active');
                    slideItem[i].nextElementSibling.classList.add('active');
                    break;
                }
            }
        });
    }

    setPrevSlideActiveClass() {
        this.$slider.dataset.slide = (parseInt(this.$slider.dataset.slide) === 1) ? this.slideCount : parseInt(this.$slider.dataset.slide) - 1;
        this.slideItems.forEach(slideItem => {

            for (let i = 0; i < this.slideCount; i++) {
                if (slideItem[i].classList.contains('active')) {
                    slideItem[i].classList.remove('active');
                    slideItem[i].previousElementSibling.classList.add('active');
                    break;
                }
            }
        });
    }

    setSlideActiveClassByClick(event) {
        var slideIndex = '';
        this.removeAllActiveClass();

        for (let io = 0; io < this.slideGroupCount; io++) {
            for (let i = 0; i < this.slideCount; i++) {
                if (event.currentTarget.isSameNode(this.slideItems[io][i])) {
                    slideIndex = i;
                    this.$slider.dataset.slide = slideIndex + 1;
                    break;
                }
            }
            if (slideIndex) {
                break;
            }
        }

        for (let io = 0; io < this.slideGroupCount; io++) {
            this.slideItems[io][slideIndex].classList.add('active');
        }
    }

    nextSlide() {
        var slideLastOfType = this.$slider.querySelector(this.slideClassName + '.active' + ':last-of-type');
        if (slideLastOfType && !this.loop) {
            //do nothing
        } else if (slideLastOfType) {
            this.setFirstSlideActiveClass();
        } else {
            this.setNextSlideActiveClass();
        }
    }

    prevSlide() {
        var slideFirstOfType = this.$slider.querySelector(this.slideClassName + '.active' + ':first-of-type');
        if (slideFirstOfType && !this.loop) {
            //do nothing
        } else if (slideFirstOfType) {
            this.setLastSlideActiveClass();
        } else {
            this.setPrevSlideActiveClass();
        }
    }

}
