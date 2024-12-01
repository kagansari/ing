import {expect, fixture, html} from '@open-wc/testing';
import {NavbarElement} from '../../components/navbar-element';

suite('navbar-element', () => {
  test('is defined', () => {
    const el = document.createElement('navbar-element');
    expect(el).to.be.instanceOf(NavbarElement);
  });

  test('changes language', async () => {
    const el = await fixture(html`<navbar-element></navbar-element>`);

    const langDropdownBtn = el.shadowRoot.querySelector(
      '.language-dropdown button'
    );
    langDropdownBtn.click();
    const trBtn = el.shadowRoot.querySelector('[data-test-id="tr-button"]');
    expect(trBtn, 'Turkish button should exist').to.exist;
    trBtn.click();
  });
});
