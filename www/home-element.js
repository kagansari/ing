import {LitElement, html} from 'lit';
import './pages/employees-list-element.js';

export class HomeElement extends LitElement {
  render() {
    return html`<employees-list-element></employees-list-element>`;
  }
}
customElements.define('home-element', HomeElement);
