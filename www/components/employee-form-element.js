import {LitElement, html, css} from 'lit';
import globalStyles from '../style';
import {msg, updateWhenLocaleChanges} from '@lit/localize';
import {Router} from '@vaadin/router';

export class EmployeeFormElement extends LitElement {
  static get styles() {
    return [
      globalStyles,
      css`
        :host {
          background-color: white;
          border-radius: var(--radius);
        }
        form {
          max-width: 768px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          margin: 0 auto;
          padding: 48px 16px;
        }
        @media (min-width: 768px) {
          form {
            grid-template-columns: 1fr 1fr;
          }
        }
        form label {
          display: block;
          color: var(--ing-orange);
        }
        form input,
        form select {
          padding: 8px;
          margin-top: 4px;
        }
        form button {
          padding: 8px;
        }
        @media (min-width: 768px) {
          form button {
            grid-column: span 2;
          }
        }

        form input[type='text'],
        form input[type='email'],
        form input[type='date'],
        form input[type='tel'],
        form input[type='password'],
        form select,
        form textarea {
          width: 100%;
          padding: 16px;
          background-color: var(--grey-bg);
        }
        form input[type='submit'] {
          background-color: var(--ing-orange);
          color: white;
        }
        form input[type='submit']:hover {
          background-color: var(--ing-dark-blue);
        }
      `,
    ];
  }

  static get properties() {
    return {
      employee: {type: Object, attribute: true},
    };
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.employee = null;
    this._populateForm();
  }

  attributeChangedCallback(name, _oldVal, newVal) {
    // TODO: Find out why default options are not working for employee property
    if (name === 'employee') {
      try {
        this.employee = JSON.parse(newVal);
        this._populateForm();
      } catch (e) {
        console.error('Failed to parse employee attribute:', e);
        this.employee = null;
      }
    }
  }

  _populateForm() {
    this.firstName = this.employee?.firstName || '';
    this.lastName = this.employee?.lastName || '';
    this.dateOfEmployment = this.employee?.dateOfEmployment || '';
    this.dateOfBirth = this.employee?.dateOfBirth || '';
    this.phone = this.employee?.phone || '';
    this.email = this.employee?.email || '';
    this.department = this.employee?.department || 'Analytics';
    this.position = this.employee?.position || 'Junior';
  }

  render() {
    return html`
      <form @submit=${this._handleSubmit}>
        <label>
          ${msg('First Name')}
          <input
            data-test-id="first-name"
            type="text"
            .value=${this.firstName}
            @input=${(e) => (this.firstName = e.target.value)}
            required
            maxlength="50"
          />
        </label>
        <label>
          ${msg('Last Name')}
          <input
            data-test-id="last-name"
            type="text"
            .value=${this.lastName}
            @input=${(e) => (this.lastName = e.target.value)}
            required
            maxlength="50"
          />
        </label>
        <label>
          ${msg('Date of Employment')}
          <input
            data-test-id="date-of-employment"
            type="date"
            .value=${this.dateOfEmployment}
            @input=${(e) => (this.dateOfEmployment = e.target.value)}
            required
            min="1900-01-01"
            max=${new Date().toISOString().split('T')[0]}
          />
        </label>
        <label>
          ${msg('Date of Birth')}
          <input
            data-test-id="date-of-birth"
            type="date"
            .value=${this.dateOfBirth}
            @input=${(e) => (this.dateOfBirth = e.target.value)}
            required
            min="1900-01-01"
            max=${new Date().toISOString().split('T')[0]}
          />
        </label>
        <label>
          ${msg('Phone Number')}
          <input
            data-test-id="phone"
            type="tel"
            .value=${this.phone}
            @input=${(e) => (this.phone = e.target.value)}
            required
          />
        </label>
        <label>
          ${msg('Email Address')}
          <input
            data-test-id="email"
            type="email"
            .value=${this.email}
            @input=${(e) => (this.email = e.target.value)}
            required
          />
        </label>
        <label>
          ${msg('Department')}
          <select
            .value=${this.department}
            @change=${(e) => (this.department = e.target.value)}
          >
            <option value="Analytics">${msg('Analytics')}</option>
            <option value="Tech">${msg('Tech')}</option>
          </select>
        </label>
        <label>
          ${msg('Position')}
          <select
            .value=${this.position}
            @change=${(e) => (this.position = e.target.value)}
          >
            <option value="Junior">${msg('Junior')}</option>
            <option value="Medior">${msg('Medior')}</option>
            <option value="Senior">${msg('Senior')}</option>
          </select>
        </label>
        <br />
        <button type="submit">${msg('Save')}</button>
        <button
          type="button"
          class="secondary"
          @click=${() => Router.go('/employees')}
        >
          ${msg('Cancel')}
        </button>
      </form>
    `;
  }

  _handleSubmit(event) {
    event.preventDefault();
    const newEmployee = {
      id: this.employee?.id,
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfEmployment: this.dateOfEmployment,
      dateOfBirth: this.dateOfBirth,
      phone: this.phone,
      email: this.email,
      department: this.department,
      position: this.position,
    };
    this.dispatchEvent(
      new CustomEvent('employee-saved', {detail: newEmployee})
    );
  }
}

window.customElements.define('employee-form-element', EmployeeFormElement);
