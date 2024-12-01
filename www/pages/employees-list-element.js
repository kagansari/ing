import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';
import {msg} from '@lit/localize';
import {connect} from 'pwa-helpers';
import store from '../store';
import '../components/confirm-modal.js';
import {
  deleteIcon,
  editIcon,
  gridIcon,
  leftIcon,
  listIcon,
  rightIcon,
} from '../components/icons.js';
import globalStyles from '../style.js';

class EmployeesListElement extends connect(store)(LitElement) {
  static get styles() {
    return [
      globalStyles,
      css`
        :host {
          display: block;
          padding: 16px;
        }
        .container {
          max-width: var(--lg-breakpoint);
          margin: 0 auto;
        }
        .grow {
          flex-grow: 1;
        }
        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .controls h2 {
          font-weight: normal;
          color: var(--ing-orange);
        }
        .controls .list-grid-radio {
          display: flex;
          align-items: center;
        }
        .table-container {
          max-width: 100%;
          overflow-x: scroll;
          border-radius: 8px;
        }
        table {
          background-color: white;
          border-collapse: collapse;
        }
        table tr {
          border-bottom: 2px solid var(--grey-bg);
        }
        table th {
          color: var(--ing-orange);
          font-size: 14px;
          font-weight: 500;
          padding: 20px;
          white-space: nowrap;
        }
        table td {
          padding: 20px;
          white-space: nowrap;
        }
        table td.light {
          color: var(--text-secondary);
        }
        table td.center,
        table th.center {
          text-align: center;
        }
        table td:last-child {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .card-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
      `,
    ];
  }

  static get properties() {
    return {
      employees: {type: Array},
      searchQuery: {type: String},
      currentPage: {type: Number},
      itemsPerPage: {type: Number},
      displayFormat: {type: String},
      employeeToDelete: {type: Object},
    };
  }

  constructor() {
    super();
    this.employees = [];
    this.searchQuery = '';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.displayFormat = 'table'; // or 'card'
    this.employeeToDelete = null;
  }

  get _pages() {
    const endNumber = Math.ceil(
      this._filteredEmployees.length / this.itemsPerPage
    );
    return Array.from({length: endNumber}, (_, i) => i + 1);
  }

  get _filteredEmployees() {
    return this.employees.filter(
      (employee) =>
        employee.firstName
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get _paginatedEmployees() {
    const paginatedEmployees = this._filteredEmployees.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );

    return paginatedEmployees;
  }

  render() {
    return html`
      <div class="container">
        <div class="controls">
          <h2>${msg('Employee List')}</h2>
          <span class="grow"></span>
          <input type="text" placeholder="Search..." @input=${this._onSearch} />

          <div class="list-grid-radio">
            <button
              class=${this.displayFormat === 'table'
                ? 'orange'
                : 'orange passive'}
              @click=${() => this._onFormatChange('table')}
            >
              ${listIcon}
            </button>
            <button
              class=${this.displayFormat === 'card'
                ? 'orange'
                : 'orange passive'}
              @click=${() => this._onFormatChange('card')}
            >
              ${gridIcon}
            </button>
          </div>
        </div>

        ${this.displayFormat === 'table'
          ? this._renderTable(this._paginatedEmployees)
          : this._renderCard(this._paginatedEmployees)}
        <div class="pagination">
          <button
            class="orange"
            @click=${this._prevPage}
            ?disabled=${this.currentPage === 1}
          >
            ${leftIcon}
          </button>
          <span class="pages">
            ${this._pages.map((page) => {
              return html`
                <button
                  class=${page === this.currentPage ? 'active' : ''}
                  @click=${() => this._goPage(page)}
                >
                  ${page}
                </button>
              `;
            })}
          </span>
          <button
            class="orange"
            @click=${this._nextPage}
            ?disabled=${this.currentPage * this.itemsPerPage >=
            this._filteredEmployees.length}
          >
            ${rightIcon}
          </button>
        </div>
      </div>
    `;
  }

  _renderCard(employees) {
    return html` <div class="card-container"></div> `;
  }

  _renderTable(employees) {
    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>First Name</th>
              <th>Last Name</th>
              <th class="center">Date of Employment</th>
              <th class="center">Date of Birth</th>
              <th class="center">Phone</th>
              <th class="center">Email</th>
              <th class="center">Department</th>
              <th class="center">Position</th>
              <th class="center">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${employees.map(
              (employee) => html`
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>${employee.firstName}</td>
                  <td>${employee.lastName}</td>
                  <td class="light center">${employee.dateOfEmployment}</td>
                  <td class="light center">${employee.dateOfBirth}</td>
                  <td class="light center">${employee.phone}</td>
                  <td class="light center">${employee.email}</td>
                  <td class="light center">${employee.department}</td>
                  <td class="light center">${employee.position}</td>
                  <td class="center">
                    <button
                      class="orange"
                      @click=${() => this._editEmployee(employee)}
                    >
                      ${editIcon}
                    </button>
                    <button
                      class="orange"
                      @click=${() => this._openModal(employee)}
                    >
                      ${deleteIcon}
                    </button>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  _renderEmployeeName(employee) {
    return html`${employee?.firstName} ${employee?.lastName}`;
  }

  _onSearch(event) {
    this.searchQuery = event.target.value;
    this.currentPage = 1;
  }

  _onFormatChange(newDisplayFormat) {
    this.displayFormat = newDisplayFormat;
  }

  _prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  _nextPage() {
    this.currentPage++;
  }

  _goPage(page) {
    this.currentPage = page;
  }

  _editEmployee(employee) {
    Router.go(`/employees/${employee.id}`);
  }

  _openModal(employee) {
    this.employeeToDelete = employee;
  }

  _handleModalClosed() {
    this.employeeToDelete = null;
  }
}

window.customElements.define('employees-list-element', EmployeesListElement);
