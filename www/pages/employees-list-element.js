import {msg, str, updateWhenLocaleChanges} from '@lit/localize';
import {Router} from '@vaadin/router';
import {LitElement, css, html} from 'lit';
import {connect} from 'pwa-helpers';
import '../components/confirm-modal.js';
import {
  deleteIcon,
  editIcon,
  gridIcon,
  leftIcon,
  listIcon,
  mailIcon,
  notFoundIcon,
  phoneIcon,
  rightIcon,
} from '../components/icons.js';
import store, {deleteEmployee, deleteMultipleEmployees} from '../store';
import globalStyles from '../style.js';

export class EmployeesListElement extends connect(store)(LitElement) {
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
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 16px;
        }
        .controls h2 {
          font-weight: normal;
          color: var(--ing-orange);
        }
        @media (max-width: 768px) {
          .controls h2 {
            width: 100%;
          }
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
          min-width: 100%;
          background-color: white;
          border-collapse: collapse;
        }
        table tr {
          border-bottom: 2px solid var(--grey-bg);
        }
        table th {
          max-width: 300px;
          color: var(--ing-orange);
          font-size: 14px;
          font-weight: 500;
          padding: 20px 12px;
          white-space: nowrap;
          text-align: left;
        }
        table td {
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 20px 12px;
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
        @media (min-width: 600px) {
          .card-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .card-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .card-container .card {
          background-color: white;
          border-radius: 16px;
        }
        .card-container .card .section {
          display: flex;
          flex-direction: column;
          padding: 16px;
          border-bottom: 2px solid var(--grey-bg);
        }
        .card-container .card h3 {
          margin: 0;
          font-weight: normal;
        }
        .card-container .card .col {
          /* width: 50%; */
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .card-container .card .label {
          font-size: 12px;
          color: var(--ing-orange);
          opacity: 0.75;
        }
        .card-container .card .light {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .card-container .card svg {
          width: 24px;
          opacity: 0.75;
        }
        .card-container .card path {
          fill: var(--ing-orange);
        }
        .card-container .card .actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding: 16px;
        }
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }
        .pagination .pages button {
          width: 36px;
          height: 36px;
          color: var(--text-secondary);
          background-color: transparent;
          border: 0;
          font-size: 20px;
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }
        .pagination .pages button:not([disabled]):hover {
          background-color: var(--dark-grey-bg);
          cursor: pointer;
        }
        .pagination .pages button.active {
          color: white;
          background-color: var(--ing-orange);
        }
      `,
    ];
  }

  static get properties() {
    return {
      employees: {type: Array},
      searchQuery: {type: String},
      currentPage: {type: Number},
      displayFormat: {type: String},
      employeeToDelete: {type: Object},
      checkedEmployeeIds: {type: Array},
    };
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.employees = [];
    this.searchQuery = '';
    this.currentPage = 1;
    this.displayFormat = 'table'; // or 'card'
    this.employeeToDelete = null;
    this.checkedEmployeeIds = [];
  }

  get _itemsPerPage() {
    return this.displayFormat === 'table' ? 10 : 6;
  }

  get _pages() {
    const endNumber = Math.ceil(
      this._filteredEmployees.length / this._itemsPerPage
    );
    const pages = Array.from({length: endNumber}, (_, i) => i + 1);
    const ellipsis = '...';
    const maxPagesToShow = 5;
    const currentPage = this.currentPage;

    if (pages.length <= maxPagesToShow) {
      return pages;
    }

    const firstPage = pages[0];
    const lastPage = pages[pages.length - 1];
    const startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    const endPage = Math.min(startPage + maxPagesToShow - 1, endNumber);

    const visiblePages = pages.slice(startPage - 1, endPage);

    if (startPage > 2) {
      visiblePages.unshift(ellipsis);
      visiblePages.unshift(firstPage);
    } else if (startPage === 2) {
      visiblePages.unshift(firstPage);
    }

    if (endPage < endNumber - 1) {
      visiblePages.push(ellipsis);
      visiblePages.push(lastPage);
    } else if (endPage === endNumber - 1) {
      visiblePages.push(lastPage);
    }

    return visiblePages;
  }

  get _filteredEmployees() {
    return this.employees.filter((employee) => {
      return (
        employee.firstName
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        employee.lastName
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        employee.department
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        employee.position.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });
  }

  get _paginatedEmployees() {
    const paginatedEmployees = this._filteredEmployees.slice(
      (this.currentPage - 1) * this._itemsPerPage,
      this.currentPage * this._itemsPerPage
    );

    return paginatedEmployees;
  }

  stateChanged(state) {
    this.employees = state.employees;
  }

  render() {
    const deletingEmployeeName = `${this.employeeToDelete?.firstName} ${this.employeeToDelete?.lastName}`;
    return html`
      <div class="container">
        <div class="controls">
          <h2>${msg('Employee List')}</h2>
          ${this.checkedEmployeeIds?.length > 0
            ? html`
                <span>
                  ${this.checkedEmployeeIds.length} ${msg('records selected')}
                </span>
                <button
                  class="orange"
                  data-test-id="delete-multiple-button"
                  @click=${() => this._openModal(this.checkedEmployeeIds)}
                >
                  ${deleteIcon}
                </button>
              `
            : ''}
          <span class="grow"></span>
          <input
            data-test-id="search-input"
            type="text"
            placeholder=${msg('Search...')}
            @input=${this._onSearch}
          />

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

        ${this._filteredEmployees.length === 0
          ? html`
              <div class="not-found">
                ${notFoundIcon}
                <h2>${msg('No record found')}</h2>
              </div>
            `
          : this.displayFormat === 'table'
          ? this._renderTable(this._paginatedEmployees)
          : this._renderCard(this._paginatedEmployees)}
        <div class="pagination">
          <button
            data-test-id="prev-page-button"
            class="orange"
            @click=${this._prevPage}
            ?disabled=${this.currentPage === 1}
          >
            ${leftIcon}
          </button>
          <span class="pages">
            ${this._pages.map((page) => {
              if (page === '...') {
                return html`<button disabled>...</button>`;
              }
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
            data-test-id="next-page-button"
            class="orange"
            @click=${this._nextPage}
            ?disabled=${this.currentPage * this._itemsPerPage >=
            this._filteredEmployees.length}
          >
            ${rightIcon}
          </button>
        </div>
      </div>

      <confirm-modal
        .isOpen=${!!this.employeeToDelete}
        .employee=${this.employeeToDelete}
        @confirm=${this._handleDelete}
        @close=${this._handleModalClosed}
      >
        ${this.checkedEmployeeIds.length > 0
          ? msg(str`${this.checkedEmployeeIds.length} records will be deleted`)
          : msg(
              str`Selected employee record of "${deletingEmployeeName}" will be deleted`
            )}
      </confirm-modal>
    `;
  }

  _renderTable(employees) {
    const allChecked = this._paginatedEmployees.every((employee) =>
      this.checkedEmployeeIds.includes(employee.id)
    );

    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  .checked=${allChecked}
                  @change=${this._onHeaderCheckboxChange}
                />
              </th>
              <th>${msg('First Name')}</th>
              <th>${msg('Last Name')}</th>
              <th class="center">${msg('Date of Employment')}</th>
              <th class="center">${msg('Date of Birth')}</th>
              <th class="center">${msg('Phone')}</th>
              <th class="center">${msg('Email')}</th>
              <th class="center">${msg('Department')}</th>
              <th class="center">${msg('Position')}</th>
              <th class="center">${msg('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${employees.map(
              (employee) => html`
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      .checked=${this.checkedEmployeeIds.includes(employee.id)}
                      @change=${(e) => this._onCheckboxChange(e, employee.id)}
                    />
                  </td>
                  <td>${employee.firstName}</td>
                  <td>${employee.lastName}</td>
                  <td class="light center">
                    ${formatDate(employee.dateOfEmployment)}
                  </td>
                  <td class="light center">
                    ${formatDate(employee.dateOfBirth)}
                  </td>
                  <td class="light center">${employee.phone}</td>
                  <td class="light center">${employee.email}</td>
                  <td class="light center">
                    ${this._renderEmployeeDepartment(employee.department)}
                  </td>
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
                      data-test-id="delete-button"
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

  _renderCard(employees) {
    return html`
      <div class="card-container">
        ${employees.map(
          (employee) => html`
            <div class="card">
              <div class="section">
                <h3>${employee.firstName} ${employee.lastName}</h3>
              </div>
              <div class="section">
                <span class="light">${phoneIcon} ${employee.phone}</span>
                <span class="light">${mailIcon} ${employee.email}</span>
                <br />
                <div style="display: flex; flex-wrap: nowrap;">
                  <div class="col">
                    <span class="label">${msg('Date of Employment')}</span>
                    <span class="light"
                      >${formatDate(employee.dateOfEmployment)}</span
                    >
                    <span class="label">${msg('Date of Birth')}</span>
                    <span class="light"
                      >${formatDate(employee.dateOfBirth)}</span
                    >
                  </div>
                  <div class="col">
                    <span class="label">${msg('Department')}</span>
                    <span class="light"
                      >${this._renderEmployeeDepartment(
                        employee.department
                      )}</span
                    >
                    <span class="label">${msg('Position')}</span>
                    <span class="light">${employee.position}</span>
                  </div>
                </div>
              </div>
              <div class="actions">
                <button
                  class="orange"
                  @click=${() => this._editEmployee(employee)}
                >
                  ${editIcon}
                </button>
                <button
                  class="orange"
                  data-test-id="delete-button"
                  @click=${() => this._openModal(employee)}
                >
                  ${deleteIcon}
                </button>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  _renderEmployeeDepartment(department) {
    switch (department) {
      case 'Tech':
        return msg('Tech');
      case 'Analytics':
        return msg('Analytics');
      default:
        console.error('Unknown department', department);
        return '';
    }
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

  _handleDelete(event) {
    const checkedEmployeeIdsLength = this.checkedEmployeeIds.length;
    if (checkedEmployeeIdsLength > 0) {
      store.dispatch(deleteMultipleEmployees(this.checkedEmployeeIds));
      this.checkedEmployeeIds = [];
      window
        .Toastify?.({
          text: msg(
            str`${checkedEmployeeIdsLength} employees deleted successfully.`
          ),
          duration: 3000,
          close: true,
        })
        ?.showToast();
    } else if (this.employeeToDelete) {
      const employee = event.detail;
      store.dispatch(deleteEmployee(employee.id));
      const fullName = `${employee.firstName} ${employee.lastName}`;
      window
        .Toastify?.({
          text: msg(str`Employee "${fullName}" deleted successfully.`),
          duration: 3000,
          close: true,
        })
        ?.showToast();
    } else {
      console.error('No employee to delete');
    }
    if (this.currentPage > this._pages.length) {
      this.currentPage = this._pages.length;
    }
  }

  _onCheckboxChange(event, employeeId) {
    if (event.target.checked) {
      this.checkedEmployeeIds = [...this.checkedEmployeeIds, employeeId];
    } else {
      this.checkedEmployeeIds = this.checkedEmployeeIds.filter(
        (id) => id !== employeeId
      );
    }
  }

  _onHeaderCheckboxChange(event) {
    if (event.target.checked) {
      this.checkedEmployeeIds = this._paginatedEmployees.map(
        (employee) => employee.id
      );
    } else {
      this.checkedEmployeeIds = [];
    }
  }
}

window.customElements.define('employees-list-element', EmployeesListElement);

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}
