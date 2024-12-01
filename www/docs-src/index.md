---
layout: page.11ty.cjs
title: <home-element> ⌲ Home
---

# &lt;home-element>

`<home-element>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<home-element>` is just an HTML element. You can it anywhere you can use HTML!

```html
<home-element></home-element>
```

  </div>
  <div>

<home-element></home-element>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<home-element>` can be configured with attributed in plain HTML.

```html
<home-element name="HTML"></home-element>
```

  </div>
  <div>

<home-element name="HTML"></home-element>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<home-element>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name = 'lit-html';

render(
  html`
    <h2>This is a &lt;home-element&gt;</h2>
    <home-element .name=${name}></home-element>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;home-element&gt;</h2>
<home-element name="lit-html"></home-element>

  </div>
</section>
