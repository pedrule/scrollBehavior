import { PolymerElement } from '@polymer/polymer/polymer-element';
import { ScrollBehavior } from "../index.js";
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';

export class MockWc extends ScrollBehavior(PolymerElement) {

    static get template() {
        return `
            <style include="iron-flex iron-flex-alignment">
                :host{
                    height: 300px;
                    width: 50vw;
                }

                ::slotted(*) {
                    height: 70px;
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