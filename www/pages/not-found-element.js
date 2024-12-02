import {msg, updateWhenLocaleChanges} from '@lit/localize';
import {LitElement, css, html} from 'lit';
import {notFoundIcon} from '../components/icons';
import globalStyles from '../style';

class NotFoundElement extends LitElement {
  static styles = [
    globalStyles,
    css`
      :host {
        display: block;
        padding: 64px 16px;
      }
    `,
  ];

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {
    return html`
      <div class="not-found">
        ${notFoundIcon}
        <h2>${msg('Page Not Found')}</h2>
      </div>
    `;
  }
}

customElements.define('not-found-element', NotFoundElement);
