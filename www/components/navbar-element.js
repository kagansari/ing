import {msg, updateWhenLocaleChanges} from '@lit/localize';
import {LitElement, css, html} from 'lit';
import {connect} from 'pwa-helpers';
import {getLocale, setLocale} from '../locale';
import store from '../store';
import {addIcon, englishIcon, turkishIcon, userIcon} from './icons';

export class NavbarElement extends connect(store)(LitElement) {
  static get styles() {
    return css`
      nav {
        background-color: white;
      }
      .container {
        display: flex;
        max-width: var(--lg-breakpoint);
        margin: 0 auto;
        justify-content: space-around;
        align-items: center;
        gap: 8px;
      }
      a {
        display: flex;
        align-items: center;
        gap: 4px;
        text-decoration: none;
        padding: 8px 0;
        color: var(--ing-orange);
        transition: color 0.3s ease, opacity 0.3s ease;
      }
      a:hover,
      a.passive:hover {
        opacity: 1;
        color: var(--ing-dark-blue);
      }
      a.passive {
        opacity: 0.6;
      }
      a svg,
      a path {
        stroke: var(--ing-orange);
        transition: stroke 0.3s ease;
      }
      a:hover svg,
      a:hover path {
        stroke: var(--ing-dark-blue);
      }
      .logo {
        display: flex;
        opacity: 0.85;
        transition: opacity 0.3s ease;
        align-items: center;
        font-family: 'Times New Roman', Times, serif;
      }
      .logo:hover {
        opacity: 1;
      }
      .logo img {
        width: 48px;
        height: 48px;
        margin-right: 8px;
      }
      .logo h3 {
        margin: 0;
        color: var(--ing-dark-blue);
        letter-spacing: 1px;
      }
      .space {
        flex-grow: 1;
      }
      .language-dropdown {
        position: relative;
        display: inline-block;
      }
      .language-dropdown .dropbtn {
        background-color: transparent;
        border: 0;
        border-radius: 8px;
        padding: 8px;
        transition: background-color 0.3s ease;
      }
      .language-dropdown:hover .dropbtn {
        background-color: #ddd;
      }
      .language-dropdown .dropdown-content {
        max-height: 0;
        opacity: 0;
        position: absolute;
        margin-top: 12px;
        right: 0;
        min-width: 160px;
        z-index: 1;
        background-color: #f9f9f9;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        transition: opacity 0.3s ease, max-height 0.3s ease;
        overflow: hidden;
      }
      .language-dropdown:hover .dropdown-content {
        opacity: 1;
        max-height: 120px;
      }
      .language-dropdown .dropdown-content a {
        display: flex;
        align-items: center;
        gap: 16px;
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        transition: background-color 0.3s ease;
      }
      .language-dropdown .dropdown-content a:hover {
        background-color: #ddd;
      }
    `;
  }

  static get properties() {
    return {
      currentPath: {type: String},
      lang: {type: String},
    };
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.currentPath = window.location.pathname;
    this.lang = store.getState().lang;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', this._onPopState.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this._onPopState.bind(this));
    super.disconnectedCallback();
  }

  _onPopState() {
    this.currentPath = window.location.pathname;
  }

  stateChanged(state) {
    this.lang = state.lang;
  }

  _changeLanguage(lang) {
    localStorage.setItem('locale', lang);
    setLocale(lang);
  }

  render() {
    const path = this.currentPath;
    return html`
      <nav>
        <div class="container">
          <a href="/" class="logo">
            <img src="/assets/logo.png" alt="Logo" />
            <h3>ING</h3>
          </a>
          <span class="space"></span>
          <a
            data-test-id="nav-employees-link"
            href="/employees"
            class="${path === '/employees' ? '' : 'passive'}"
          >
            ${userIcon} ${msg('Employees')}
          </a>
          <a
            data-test-id="nav-add-new-link"
            href="/employees/new"
            class="${path === '/employees/new' ? '' : 'passive'}"
          >
            ${addIcon} ${msg('Add New')}
          </a>
          <div class="language-dropdown">
            <button class="dropbtn">
              ${getLocale() === 'tr' ? turkishIcon : englishIcon}
            </button>
            <div class="dropdown-content">
              <a
                data-test-id="en-button"
                href="#"
                @click=${() => this._changeLanguage('en')}
              >
                ${englishIcon} ${msg('English')}
              </a>
              <a
                data-test-id="tr-button"
                href="#"
                @click=${() => this._changeLanguage('tr')}
              >
                ${turkishIcon} ${msg('Turkish')}
              </a>
            </div>
          </div>
        </div>
      </nav>
    `;
  }
}

window.customElements.define('navbar-element', NavbarElement);
