import {msg, updateWhenLocaleChanges} from '@lit/localize';
import {LitElement, css, html} from 'lit';

class NotFoundElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }
  `;

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {
    return html`<h1>${msg('Page Not Found')}</h1>`;
  }
}

customElements.define('not-found-element', NotFoundElement);
