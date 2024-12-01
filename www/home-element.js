import {LitElement, html, css} from 'lit';

import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import "./pages/employees-list-element.js";

class HomeElement extends LitElement {
  render() {
    return html`<employees-list-element></employees-list-element>`;
  }
}
customElements.define('home-element', HomeElement);
