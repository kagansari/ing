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

  test('filters employees based on search query', async () => {
    const el = await fixture(
      html`<employees-list-element></employees-list-element>`
    );

    const searchInput = el.shadowRoot.querySelector(
      '[data-test-id="search-input"]'
    );
    searchInput.value = 'John';
    searchInput.dispatchEvent(new Event('input'));
    await el.updateComplete;

    expect(el._filteredEmployees.length).to.equal(2);
    expect(el._filteredEmployees[0].firstName).to.equal('John');
  });

  test('paginates employees', async () => {
    const el = await fixture(
      html`<employees-list-element></employees-list-element>`
    );
    await el.updateComplete;
    expect(el._paginatedEmployees.length).to.equal(10);

    el.shadowRoot.querySelector('[data-test-id="next-page-button"]').click();
    await el.updateComplete;
    expect(el.currentPage, 'page should be set to 2').to.equal(2);

    el.shadowRoot.querySelector('[data-test-id="prev-page-button"]').click();
    await el.updateComplete;
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
    await el.updateComplete;

    const firstEmployee = el.employees[0];
    const firstDeleteButton = el.shadowRoot.querySelector(
      '[data-test-id="delete-button"]'
    );
    expect(firstDeleteButton, 'delete icon button should exist').to.exist;
    firstDeleteButton.click();
    await el.updateComplete;

    const confirmModal = el.shadowRoot.querySelector('confirm-modal');
    expect(confirmModal, 'confirmation modal should exist').to.exist;
    expect(confirmModal.isOpen, 'confirmation modal should be open').to.be.true;

    const confirmButton = confirmModal.shadowRoot.querySelector(
      '.modal button[type="submit"]'
    );
    expect(confirmButton, 'confirm button should exist').to.exist;
    confirmButton.click();
    await el.updateComplete;

    const nextFirstEmployee = el.employees[0];
    expect(
      nextFirstEmployee,
      'first employee should have changed'
    ).to.not.equal(firstEmployee);
  });
});
