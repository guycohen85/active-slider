class ActiveSlider {
    constructor({
        wrapper = '', //(string)(required) - Select the wrapper element. example: '.slider'
        activeElements = '', //(array|string)(required) - Select elements to add the active class. example: ['.slide-image', '.bullet']
        swipeArea = '', //(string)(optional) - Select the element that will be the swipe area. example: '.slide-images-container'
        clickableElements = '', //(array|string)(optional) - Add the active class to the clicked element. example: '.bullet'
        prevNextButtons = false, //(array)(optional) - Select the previous and next buttons. example: ['.prev', '.next']
        autoPlay = true, //(boolean)(optional) - Is autoplay. Default: true
        autoplaySpeed = 3500, //(number)(optional) - Autoplay duration in milliseconds. Default: 3500
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

        if(firstElementActive){
            this.wrapper.setAttribute("data-active", 1);
            this.first();
        }

        //Autoplay
        this.autoPlaySpeed = autoplaySpeed;
        this.autoPlay = autoPlay;
        if (this.autoPlay) {
            this.autoplay();
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
            this.prev();
        });
        this.nextBtn = document.querySelector(prevNextButtons[1]);
        this.nextBtn.addEventListener('click', () => {
            this.next();
        });
    }

    autoplay() {  
        this.interval = setInterval(() => {
            this.next();
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
        clearInterval(this.interval);
    }

    _clickEvent(){
        if (this.clickableElements) {
            if (Array.isArray(this.clickableElements)) {
                this.clickableElements.forEach(function (items) {
                    document.querySelectorAll(items).forEach(el => {
                        el.addEventListener('click', (e) => {
                            this._elementActiveClassByClick(e);
                        });
                    });
                });
            } else {
                document.querySelectorAll(this.clickableElements).forEach(el => {
                    el.addEventListener('click', (e) => {
                        this._elementActiveClassByClick(e);
                    });
                });
            }
        }
    }

    _swipeEvent(){
        if (this.swipeArea) {
            this.touchstartX = 0;
            this.swipeArea.addEventListener('touchstart', (event) => {
                this.touchstartX = event.changedTouches[0].screenX;
            }, false);

            this.swipeArea.addEventListener('touchend', (event) => {
                var touchendX = event.changedTouches[0].screenX;
                if (touchendX <= this.touchstartX && (this.touchstartX - touchendX) > 25) {
                    this.next(); //Swiped left
                }

                if (touchendX >= this.touchstartX && (touchendX - this.touchstartX) > 25) {
                    this.prev(); //Swiped right
                }
            }, false);
        }
    }

    removeAll() {
        this.activeElements.forEach(element => {
            element.forEach(el => {
                el.classList.remove("active");
            });
        });
    }

    first() {
        this.removeAll();
        this.wrapper.dataset.active = 1;
        this.activeElements.forEach(element => {
            element[0].classList.add("active");
        });
    }

    last() {
        this.removeAll();
        this.wrapper.dataset.active = this.elementsCount;
        this.activeElements.forEach(element => {
            element[element.length - 1].classList.add("active");
        });
    }

    _nextElementActiveClass() {
        this.wrapper.dataset.active = parseInt(this.wrapper.dataset.active) + 1;
        this.activeElements.forEach(element => {

            for (let i = 0; i < this.elementsCount; i++) {
                if (element[i].classList.contains('active')) {
                    element[i].classList.remove('active');
                    element[i].nextElementSibling.classList.add('active');
                    break;
                }
            }
        });
    }

    _prevElementActiveClass() {
        this.wrapper.dataset.active = (parseInt(this.wrapper.dataset.active) === 1) ? this.elementsCount : parseInt(this.wrapper.dataset.active) - 1;
        this.activeElements.forEach(element => {

            for (let i = 0; i < this.elementsCount; i++) {
                if (element[i].classList.contains('active')) {
                    element[i].classList.remove('active');
                    element[i].previousElementSibling.classList.add('active');
                    break;
                }
            }
        });
    }

    _elementActiveClassByClick(event) {
        var elementIndex = '';
        this.removeAll();

        for (let io = 0; io < this.elementsGroupCount; io++) {
            for (let i = 0; i < this.elementsCount; i++) {
                if (event.currentTarget.isSameNode(this.activeElements[io][i])) {
                    elementIndex = i;
                    this.wrapper.dataset.active = elementIndex + 1;
                    break;
                }
            }
            if (elementIndex) {
                break;
            }
        }

        for (let io = 0; io < this.elementsGroupCount; io++) {
            this.activeElements[io][elementIndex].classList.add('active');
        }
    }

    next() {
        var elementLastOfType = this.wrapper.querySelector(this.elementClassName + '.active' + ':last-of-type');
        if (elementLastOfType && !this.loop) {
            //do nothing
        } else if (elementLastOfType) {
            this.first();
        } else {
            this._nextElementActiveClass();
        }
    }

    prev() {
        var elementFirstOfType = this.wrapper.querySelector(this.elementClassName + '.active' + ':first-of-type');
        if (elementFirstOfType && !this.loop) {
            //do nothing
        } else if (elementFirstOfType) {
            this.last();
        } else {
            this._prevElementActiveClass();
        }
    }

}
