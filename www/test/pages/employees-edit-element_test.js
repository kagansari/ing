import {fixture, expect, html} from '@open-wc/testing';
import {EmployeeEditElement} from '../../pages/employee-edit-element';
import store from '../../store';

window.Toastify = () => ({
  showToast: () => {},
});

suite.only('employee-edit-element', () => {
  test('is defined', () => {
    const el = document.createElement('employee-edit-element');
    expect(el).to.be.instanceOf(EmployeeEditElement);
  });

  test('updates employee when inputs are correct', async () => {
    const el = await fixture(
      html`<employee-edit-element employee-id="1"></employee-edit-element>`
    );
    await el.updateCompleted;

    const employeeName = store.getState().employees[0].firstName;

    const formEl = el.shadowRoot.querySelector('employee-form-element');
    const inputFirstName = formEl.shadowRoot.querySelector(
      '[data-test-id="first-name"]'
    );
    inputFirstName.value = 'Max Emilian';
    inputFirstName.dispatchEvent(new Event('input'));

    const submitButton = formEl.shadowRoot.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton, 'submit button should exist').to.exist;
    submitButton.click();
    await el.updateCompleted;

    const confirmModal = el.shadowRoot.querySelector('confirm-modal');
    expect(confirmModal.isOpen, 'confirmation modal should be open').to.be.true;

    const confirmButton = confirmModal.shadowRoot.querySelector(
      '.modal button[type="submit"]'
    );
    confirmButton.click();
    await el.updateComplete;

    const newEmployeeName = store.getState().employees[0].firstName;

    expect(
      newEmployeeName,
      'Employee first name should be updated'
    ).not.to.equal(employeeName);
  });
});
