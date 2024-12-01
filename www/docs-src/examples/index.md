---
layout: example.11ty.cjs
title: <home-element> ⌲ Examples ⌲ Basic
tags: example
name: Basic
description: A basic example
---

<style>
  home-element p {
    border: solid 1px blue;
    padding: 8px;
  }
</style>
<home-element>
  <p>This is child content</p>
</home-element>

<h3>CSS</h3>

```css
p {
  border: solid 1px blue;
  padding: 8px;
}
```

<h3>HTML</h3>

```html
<home-element>
  <p>This is child content</p>
</home-element>
```
