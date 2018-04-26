import { PolymerElement } from "@polymer/polymer/polymer-element";

export class RdAscensor extends PolymerElement{
    static get properties() {
        return {
            showV: {
                type: Boolean
            },

            showH: {
                type: Boolean
            },

            sizeV: {
                type: Number,
                observer: '__sizeVChanged'
            },

            sizeH: {
                type: Number,
                observer: '__sizeHChanged'
            },

            deltaV: {
                type: Number,
                observer: '__deltaVChanged'
            },

            deltaH: {
                type: Number,
                observer: '__deltaHChanged'
            },

            isHorizontalScroll: {
                type: Boolean,
                reflectToAttribute: true
            }
        }
    }
    static get template() {
        return `
        <style include="iron-flex iron-flex-alignment">
            :host{
                pointer-events: none;
                @apply --layout-horizontal;
                --weight-scroll-container: 6px;
                position: absolute;
                -webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;
                cursor: pointer;
                --background-ascensor: #eeeeee;
                --color-ascensor: #111111;
            }

            .container{
                background: var(--background-ascensor);
                transition: width .1s ease-out;
                overflow: hidden;
            }

            .scrollBar{
                background: var(--color-ascensor);
            }

            #containerH{
                width: calc(100% - var(--weight-scroll-container));
            }

            #ascensorH{
                 height: var(--weight-scroll-container);
            }

            #containerV{
               height : 100%;
               width : var(--weight-scroll-container);
            }

            div.hide{
                opacity: 0;
                pointer-events: none;
            }

            div.show{
                opacity: 1;
                pointer-events: all;
            }

            :host(:hover){
                --weight-scroll-container: 12px;

            }
        </style>
        <div id="containerH" class$="[[_hideH(showH)]] self-end container" on-mouseenter="_enableHorizontalScroll" on-mouseleave="_disableHorizontalScroll">
            <div id="ascensorH" class="scrollBar"></div>
        </div>

        <div id="containerV" class$="[[_hideV(showV)]] container">
            <div id="ascensorV" class="scrollBar"></div>
        </div>
        `
    }

    _hideH(showH){
        return showH ? 'show' : 'hide';
    }

    _hideV(showV){
        return showV ? 'show' : 'hide';
    }

    __sizeVChanged(arg) {
        this.$.ascensorV.style.height = `${arg}px`
    }

    __sizeHChanged(arg) {
        // we set width of horizontal scroll but we diminute it from width of vertical scroll
        this.$.ascensorH.style.width = `${arg - this.$.containerV.getBoundingClientRect().width}px`; 
    }

    __deltaVChanged(arg) {
        this.$.ascensorV.style.transform = `translateY(${arg}px)`;
    }

    checkDeltaV(delta) {
        if (isNaN(delta) || delta === undefined || delta < 0) return 0;
        if (delta > (this.$.containerV.getBoundingClientRect().height - this.$.ascensorV.getBoundingClientRect().height)) return this.$.containerV.getBoundingClientRect().height - this.$.ascensorV.getBoundingClientRect().height;
        return delta;
    }

    __deltaHChanged(arg) {
        this.$.ascensorH.style.transform = `translateX(${arg}px)`;
    }

    checkDeltaH(delta) {
        if (isNaN(delta) || delta === undefined || delta < 0) return 0;
        if (delta > (this.$.containerH.getBoundingClientRect().width - this.$.ascensorH.getBoundingClientRect().width)) return this.$.containerH.getBoundingClientRect().width - this.$.ascensorH.getBoundingClientRect().width;
        return delta;
    }

    _enableHorizontalScroll(event) {
        this.isHorizontalScroll = true;
    }

    _disableHorizontalScroll() {
        this.isHorizontalScroll = false;
    }
}
customElements.define('rd-scrollbar', RdAscensor);