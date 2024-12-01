import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';
import store, {addEmployee} from '../store.js';
import '../components/employee-form-element.js';
import {msg, str, updateWhenLocaleChanges} from '@lit/localize';

export class EmployeeCreateElement extends LitElement {
  static get styles() {
    return css`
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
    `;
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {
    return html`
      <div class="container">
        <div>
          <h2>${msg('Creating New Employee')}</h2>
        </div>
        <employee-form-element @employee-saved=${this._handleEmployeeSaved}>
        </employee-form-element>
      </div>
    `;
  }

  _handleEmployeeSaved(event) {
    const newEmployee = event.detail;
    const employees = store.getState().employees;
    newEmployee.id = Math.max(...employees.map((employee) => employee.id)) + 1;

    const isDuplicate = employees.find(
      (employee) => employee.email === newEmployee.email
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
      store.dispatch(addEmployee(newEmployee));
      const fullName = `${newEmployee.firstName} ${newEmployee.lastName}`;
      window
        .Toastify?.({
          text: msg(str`Employee "${fullName}" created successfully.`),
          duration: 3000,
          close: true,
        })
        ?.showToast();
      Router.go('/employees');
    }
  }
}

window.customElements.define('employee-create-element', EmployeeCreateElement);
