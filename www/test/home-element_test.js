import {expect, fixture} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {HomeElement} from '../home-element.js';

suite('home-element', () => {
  test('is defined', () => {
    const el = document.createElement('home-element');
    expect(el).to.be.instanceOf(HomeElement);
  });

  test('renders employees', async () => {
    const el = await fixture(html`<home-element></home-element>`);
    expect(el).to.be.instanceOf(HomeElement);
  });

  test('renders employees', async () => {
    const el = await fixture(html`<home-element></home-element>`);
    const listEl = el.shadowRoot.querySelector('employees-list-element');
    const rows = listEl.shadowRoot.querySelectorAll('table tbody tr');
    expect(rows.length).to.equal(listEl.itemsPerPage);
  });
});
