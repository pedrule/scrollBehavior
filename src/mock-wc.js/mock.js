import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { ScrollBehavior } from "../index.js";
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';

export class MockWc extends ScrollBehavior(PolymerElement) {

    static get template() {
        return html`
            <style include="iron-flex iron-flex-alignment">
                :host{
                    height: 300px;
                    width: 50vw;
                    position: absolute;
                    top: 50px;
                    left:50px;
                }

                ::slotted(*) {
                    height: 70px;
                    width: 100vw;
                    background: grey;
                    margin:3px;
                }
            </style>
            ${super.template}
            <slot></slot>
        `
    }
}
customElements.define('fake-element', MockWc);