import {fixture, expect, html} from '@open-wc/testing';
import {EmployeesListElement} from '../../pages/employees-list-element';

suite('employees-list-element', () => {
  test('is defined', () => {
    const el = document.createElement('employees-list-element');
    expect(el).to.be.instanceOf(EmployeesListElement);
  });

  test('renders employees', async () => {
    const el = await fixture(
      html`<employees-list-element></employees-list-element>`
    );
    const rows = el.shadowRoot.querySelectorAll('table tbody tr');
    expect(rows.length).to.equal(el._itemsPerPage);
  });

  test('renders not-found content with no employees', async () => {
    const el = await fixture(
      html`<employees-list-element></employees-list-element>`
    );
    el.employees = [];
    await el.updateCompleted;
    const notFoundEl = el.shadowRoot.querySelectorAll('.not-found');
    expect(notFoundEl).to.exist;
  });

  test('filters employees based on search query', async () => {
    const el = await fixture(
      html`<employees-list-element></employees-list-element>`
    );

    const searchInput = el.shadowRoot.querySelector(
      '[data-test-id="search-input"]'
    );
    searchInput.value = 'John';
    searchInput.dispatchEvent(new Event('input'));
    await el.updateCompleted;

    expect(el._filteredEmployees.length).to.equal(2);
    expect(el._filteredEmployees[0].firstName).to.equal('John');
  });

  test('paginates employees', async () => {
    const el = await fixture(
      html`<employees-list-element></employees-list-element>`
    );
    await el.updateCompleted;
    expect(el._paginatedEmployees.length).to.equal(10);

    el.shadowRoot.querySelector('[data-test-id="next-page-button"]').click();
    await el.updateCompleted;
    expect(el.currentPage, 'page should be set to 2').to.equal(2);

    el.shadowRoot.querySelector('[data-test-id="prev-page-button"]').click();
    await el.updateCompleted;
    expect(el.currentPage, 'page should be set to 2').to.equal(1);
  });

  test('changes display format', async () => {
    const el = await fixture(
      html`<employees-list-element></employees-list-element>`
    );

    await el._onFormatChange('card');
  });

  test('deletes employee', async () => {
    const el = await fixture(
      html`<employees-list-element></employees-list-element>`
    );
    await el.updateCompleted;

    const firstEmployee = el.employees[0];
    const firstDeleteButton = el.shadowRoot.querySelector(
      '[data-test-id="delete-button"]'
    );
    expect(firstDeleteButton, 'delete icon button should exist').to.exist;
    firstDeleteButton.click();
    await el.updateCompleted;

    const confirmModal = el.shadowRoot.querySelector('confirm-modal');
    expect(confirmModal, 'confirmation modal should exist').to.exist;
    expect(confirmModal.isOpen, 'confirmation modal should be open').to.be.true;

    const confirmButton = confirmModal.shadowRoot.querySelector(
      '.modal button[type="submit"]'
    );
    expect(confirmButton, 'confirm button should exist').to.exist;
    confirmButton.click();
    await el.updateCompleted;

    const nextFirstEmployee = el.employees[0];
    expect(
      nextFirstEmployee,
      'first employee should have changed'
    ).to.not.equal(firstEmployee);
  });

  test('deletes multiple employees', async () => {
    const el = await fixture(
      html`<employees-list-element></employees-list-element>`
    );
    await el.updateCompleted;

    const employeesLength = el.employees.length;
    const checkboxEls = el.shadowRoot.querySelectorAll(
      'table tr td input[type="checkbox"]'
    );
    expect(checkboxEls, 'there should be 10 checkboxes').to.have.length(10);

    checkboxEls[0].click();
    checkboxEls[0].dispatchEvent(new Event('input'));
    await el.updateCompleted

    checkboxEls[1].click();
    checkboxEls[1].dispatchEvent(new Event('input'));
  
    await el.updateCompleted;
    expect(
      el.checkedEmployeeIds,
      'there should be 2 checked employees'
    ).to.have.length(2);

    const deleteButton = el.shadowRoot.querySelector(
      '[data-test-id="delete-multiple-button"]'
    );
    expect(deleteButton, 'delete-multiple button should exist').to.exist;
    deleteButton.click();
    await el.updateCompleted;

    const confirmModal = el.shadowRoot.querySelector('confirm-modal');
    expect(confirmModal, 'confirmation modal should exist').to.exist;
    expect(confirmModal.isOpen, 'confirmation modal should be open').to.be.true;

    const confirmButton = confirmModal.shadowRoot.querySelector(
      '.modal button[type="submit"]'
    );
    expect(confirmButton, 'confirm button should exist').to.exist;
    confirmButton.click();
    await el.updateCompleted;

    expect(el.employees.length, '2 employees should be deleted').to.equal(
      employeesLength - 2
    );

    const headerCheckboxEl = el.shadowRoot.querySelector(
      'table tr th input[type="checkbox"]'
    );
    headerCheckboxEl.click();
    headerCheckboxEl.dispatchEvent(new Event('input'));
    expect(
      el.checkedEmployeeIds,
      'there should be 10 checked employees'
    ).to.have.length(10);


  });
});
