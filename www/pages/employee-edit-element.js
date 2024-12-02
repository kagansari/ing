import {msg, str, updateWhenLocaleChanges} from '@lit/localize';
import {Router} from '@vaadin/router';
import {LitElement, css, html} from 'lit';
import {connect} from 'pwa-helpers';
import '../components/confirm-modal.js';
import '../components/employee-form-element.js';
import {notFoundIcon} from '../components/icons.js';
import store, {updateEmployee} from '../store.js';
import globalStyles from '../style.js';

export class EmployeeEditElement extends connect(store)(LitElement) {
  static get styles() {
    return [
      globalStyles,
      css`
        :host {
          display: block;
          padding: 16px;
        }
        .container {
          max-width: var(--md-breakpoint);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        h2 {
          font-weight: normal;
          color: var(--ing-orange);
        }
      `,
    ];
  }

  static get properties() {
    return {
      employees: {type: Array},
      employeeId: {type: Number, attribute: 'employee-id'},
      _employee: {type: Object, state: true},
      _confirm_employee: {type: Object, state: true},
    };
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.employees = store.getState().employees;
    this.employeeId = this.getAttribute('employee-id') || null;
    this._employee = null;

    if (this.employeeId) {
      this._employee = this.employees.find((emp) => emp.id === this.employeeId);
    }
  }

  onBeforeEnter(location) {
    this.employeeId = parseInt(location.params.id || 1);
  }

  stateChanged() {
    this.employees = store.getState().employees;
    this._employee = this.employees.find((emp) => emp.id === this.employeeId);
  }

  render() {
    if (!this._employee) {
      return html`
        <div class="not-found">
          ${notFoundIcon}
          <h2>${msg('No record found')}</h2>
        </div>
      `;
    }

    const fullName = `${this._employee?.firstName} ${this._employee?.lastName}`;
    return html`
      <div class="container">
        <div>
          <h2>${msg(str`Editing Employee "${fullName}"`)}</h2>
        </div>
        <employee-form-element
          employee=${
            // // TODO: Find out why default options are not working for employee property
            this._employee ? JSON.stringify(this._employee) : ''
          }
          @employee-saved=${(e) => (this._confirm_employee = e.detail)}
        >
        </employee-form-element>
      </div>
      <confirm-modal
        .isOpen=${!!this._confirm_employee}
        .employee=${this._employee}
        @confirm=${this._handleEmployeeSaved}
        @close=${() => (this._confirm_employee = null)}
      >
        ${msg(str`Employee record of "${fullName}" will be updated`)}
      </confirm-modal>
    `;
  }

  _handleEmployeeSaved() {
    const newEmployee = this._confirm_employee;
    const isDuplicate = this.employees.find(
      (employee) =>
        employee.id !== newEmployee.id && employee.email === newEmployee.email
    );

    if (isDuplicate) {
      window
        .Toastify?.({
          text: msg('Email is used by another employee.'),
          duration: 3000,
          close: true,
        })
        ?.showToast();
    } else {
      store.dispatch(updateEmployee(newEmployee));
      const fullName = `${newEmployee.firstName} ${newEmployee.lastName}`;
      window
        .Toastify?.({
          text: msg(str`Employee "${fullName}" updated successfully.`),
          duration: 3000,
          close: true,
        })
        ?.showToast();
      Router.go('/employees');
    }
  }
}

window.customElements.define('employee-edit-element', EmployeeEditElement);
