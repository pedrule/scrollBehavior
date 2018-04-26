import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';
import { add } from '@polymer/polymer/lib/utils/gestures';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce';
import { animationFrame } from '@polymer/polymer/lib/utils/async';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';
import './ascensor-element';

export const ScrollBehavior = (SuperClass) => class extends SuperClass {

    static get properties() {
        return {

            needScrollHeight: {
                type : Boolean,
            },

            needScrollWidth: {
                type: Boolean,
            }, 

            deltaH: {
                type: Number,
                value: 0,
                observer: "__deltaHChanged"
            },
            
            deltaV: {
                type: Number,
                value: 0,
                observer: "__deltaVChanged"
            },

            positionH: {
                type: Number
            },
        }
    }
    
    static get template(){
        return `
            ${this.styleTemplate}
            ${this.containerTemplate}
            ${this.scrollTemplate}
        `
    }

    static get containerTemplate() {
        return `
        <div id="container">
            <slot id="slot"></slot>
        </div>
        `
    }

    static get styleTemplate() {
        return `
            <style include="iron-flex iron-flex-alignment">
                :host{
                    @apply --layout-vertical;
                    overflow: hidden;
                }

                ::slotted(*){
                    -webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;
                }
            </style>
        `
    }

    static get scrollTemplate() {
        return `
            <rd-scrollbar id="scrollElement" show-v="[[needScrollHeight]]" show-h="[[needScrollWidth]]"></rd-scrollbar>
        `
    }

    constructor() {
        super();
        this._handleTrackBind = this._handleTrack.bind(this);
        this._handleWheelBind = this._handleWheel.bind(this);
        this.__handleChangeInDomBind = this.__handleChangeInDom.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();

        let observer = new MutationObserver(this.__handleChangeInDomBind);
        observer.observe(this, {childList: true, attributes: false});

        add(this, 'track', this._handleTrackBind);
        this.addEventListener('wheel', this._handleWheelBind);
        this.addEventListener('update-delta', this._handleOldDelta);

        afterNextRender(this, () => {
            this.__evaluateScroll();
        })
    }

    /**
     * callback of mutation observer
     * @param {Array} mutationList 
     */
    __handleChangeInDom(mutationList) {
        // we check if height of Element is higher than one of its container.
        this.__evaluateScroll();
    }

    /**
     * we evaluate if element need scroll element to be used
     */
    __evaluateScroll() {
        this.needScrollHeight = this.getBoundingClientRect().height < this.$.container.getBoundingClientRect().height;
        this.__adjustWidthOfContainer();
        this.needScrollWidth = this.getBoundingClientRect().width < this.$.container.getBoundingClientRect().width;
        if(this.needScrollHeight)this.__resizescrollElement();
    }

    __adjustWidthOfContainer() {
        let maxWidth = this.$.slot.assignedNodes().reduce((previous, item) => {
            let size = item.getBoundingClientRect().width;
            if(size > previous)return size;
            return previous;
        }, this.$.container.getBoundingClientRect().width);
        this.$.container.style.width = `${maxWidth}px`;
    }

    __resizescrollElement() {
        // this.$.scrollElement.style.left = `${this.getBoundingClientRect().left}px`;
        // this.$.scrollElement.style.top = `${this.getBoundingClientRect().top}px`;
        this.$.scrollElement.style.width = `${this.getBoundingClientRect().width}px`;
        this.$.scrollElement.style.height = `${this.getBoundingClientRect().height}px`;
        this.$.scrollElement.sizeV = this.getBoundingClientRect().height*(this.getBoundingClientRect().height/this.$.container.getBoundingClientRect().height);
        this.$.scrollElement.sizeH = this.getBoundingClientRect().width*(this.getBoundingClientRect().width/this.$.container.getBoundingClientRect().width);
        this.ratioV = this.$.container.getBoundingClientRect().height / this.getBoundingClientRect().height;
        this.ratioH = this.$.container.getBoundingClientRect().width / this.getBoundingClientRect().width;
    }

    get positionV() {
        return (this.getBoundingClientRect().top - this.$.container.getBoundingClientRect().top) /this.ratioV;
    }

    get positionH() {
        return (this.getBoundingClientRect().left - this.$.container.getBoundingClientRect().left) /this.ratioH;
    }

    _handleTrack(event) {
        if(this.needScrollHeight) {
            let deltaV = this.positionV + event.detail.dy*0.5;
            this.deltaV = this.$.scrollElement.checkDeltaV(deltaV);
        }
        
        if(this.needScrollWidth) {
            let deltaH = this.positionH + event.detail.dx;
            this.deltaH = this.$.scrollElement.checkDeltaH(deltaH);
        }
        this.$.container.style.transform = `translate3d(-${this.deltaH*this.ratioH}px ,-${this.deltaV*this.ratioV}px, 0)`;
        event.stopImmediatePropagation();
    }

    _handleWheel(event) {
        if(this.needScrollHeight && !this.$.scrollElement.isHorizontalScroll) {
            let deltaV = this.positionV + event.deltaY*0.1;
            this.deltaV = this.$.scrollElement.checkDeltaV(deltaV);
        }

        if(this.needScrollHeight && this.$.scrollElement.isHorizontalScroll) {
            let deltaH = this.positionH + event.deltaY;
            this.deltaH = this.$.scrollElement.checkDeltaH(deltaH);
        }
        this.$.container.style.transform = `translate3d(-${this.deltaH*this.ratioH}px ,-${this.deltaV*this.ratioV}px, 0)`;
        event.stopImmediatePropagation();
    }

    __deltaVChanged(arg) {
        // let deltaV = this.$.scrollElement.checkDeltaV(arg);
        // this.$.container.style.transform = `translateY(-${deltaV*this.ratioV}px)`;
        this.$.scrollElement.deltaV = arg;
    }

    __deltaHChanged(arg) {
        // let deltaH = this.$.scrollElement.checkDeltaH(arg);
        // this.$.container.style.transform = `translateX(-${deltaH*this.ratioH}px)`;
        this.$.scrollElement.deltaH = arg;
    }
}