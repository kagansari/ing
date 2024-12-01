import {fixture, expect, html} from '@open-wc/testing';
import {EmployeeCreateElement} from '../../pages/employee-create-element';
import store from '../../store';

window.Toastify = () => ({
  showToast: () => {},
});

const fillDetails = async (formEl) => {
  const inputFirstName = formEl.shadowRoot.querySelector(
    '[data-test-id="first-name"]'
  );
  inputFirstName.value = 'Max';
  inputFirstName.dispatchEvent(new Event('input'));

  const inputLastName = formEl.shadowRoot.querySelector(
    '[data-test-id="last-name"]'
  );
  inputLastName.value = 'Verstappen';
  inputLastName.dispatchEvent(new Event('input'));

  const inputDateOfEmployment = formEl.shadowRoot.querySelector(
    '[data-test-id="date-of-employment"]'
  );
  inputDateOfEmployment.value = '2023-01-01';
  inputDateOfEmployment.dispatchEvent(new Event('input'));

  const inputDateOfBirth = formEl.shadowRoot.querySelector(
    '[data-test-id="date-of-birth"]'
  );
  inputDateOfBirth.value = '1990-01-01';
  inputDateOfBirth.dispatchEvent(new Event('input'));

  const inputPhone = formEl.shadowRoot.querySelector('[data-test-id="phone"]');
  inputPhone.value = '123-456-7890';
  inputPhone.dispatchEvent(new Event('input'));

  const inputEmail = formEl.shadowRoot.querySelector('[data-test-id="email"]');
  inputEmail.value = 'max@example.com';
  inputEmail.dispatchEvent(new Event('input'));
};

suite.only('employee-create-element', () => {
  test('is defined', () => {
    const el = document.createElement('employee-create-element');
    expect(el).to.be.instanceOf(EmployeeCreateElement);
  });

  test('raises validation error when input is invalid', async () => {
    const el = await fixture(
      html`<employee-create-element></employee-create-element>`
    );

    const employeesLength = store.getState().employees.length;
    const formEl = el.shadowRoot.querySelector('employee-form-element');
    const submitButton = formEl.shadowRoot.querySelector(
      'button[type="submit"]'
    );

    expect(submitButton, 'submit button should exist').to.exist;
    submitButton.click();
    await formEl.updateCompleted;

    const newEmployeesLength = store.getState().employees.length;
    expect(newEmployeesLength, 'Employee should not be saved').to.equal(
      employeesLength
    );
  });

  test('raises error when email is duplicate', async () => {
    const el = await fixture(
      html`<employee-create-element></employee-create-element>`
    );
    const employeesLength = store.getState().employees.length;

    const formEl = el.shadowRoot.querySelector('employee-form-element');
    await fillDetails(formEl);

    const submitButton = formEl.shadowRoot.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton, 'submit button should exist').to.exist;

    submitButton.click();
    await formEl.updateCompleted;

    const newEmployeesLength = store.getState().employees.length;
    expect(newEmployeesLength, 'Employee should be saved').to.equal(
      employeesLength + 1
    );
  });

  test('saves employee when inputs are correct', async () => {
    const el = await fixture(
      html`<employee-create-element></employee-create-element>`
    );

    const employeesLength = store.getState().employees.length;
    const formEl = el.shadowRoot.querySelector('employee-form-element');
    await fillDetails(formEl);

    const submitButton = formEl.shadowRoot.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton, 'submit button should exist').to.exist;

    const inputEmail = formEl.shadowRoot.querySelector(
      '[data-test-id="email"]'
    );
    inputEmail.value = 'ahmet.sourtimes@example.com';
    inputEmail.dispatchEvent(new Event('input'));

    submitButton.click();
    await formEl.updateCompleted;

    const newEmployeesLength = store.getState().employees.length;

    expect(newEmployeesLength, 'Employee should not be saved').to.equal(
      employeesLength
    );
  });
});
