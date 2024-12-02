import {css} from 'lit';

const globalStyles = css`
  :root {
    --grey-bg: rgb(247, 247, 247);
    --dark-grey-bg: rgb(216, 216, 216);
    --ing-orange: rgb(255, 91, 41);
    --ing-purple: rgb(75, 70, 140);
    --ing-dark-blue: rgb(24, 31, 84);
    --text-secondary: rgb(124, 124, 124);
    --radius: 8px;
    --xs-breakpoint: 600px;
    --md-breakpoint: 1024px;
    --lg-breakpoint: 1440px;
  }
  body {
    margin: 0;
    font-family: 'Poppins', Arial, sans-serif;
    background-color: var(--grey-bg);
  }
  input[type='text'],
  input[type='email'],
  input[type='tel'],
  input[type='date'],
  select {
    padding: 12px;
    border: 1px solid #eee;
    border-radius: 8px;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
  }
  select {
    min-height: 48px;
  }
  input[type='text']:focus {
    border-color: var(--ing-orange);
  }
  input[type='checkbox'] {
    width: 20px;
    height: 20px;
  }

  button.orange,
  a.orange {
    border: 0;
    background-color: transparent;
    text-decoration: none;
  }
  button.orange:hover,
  button.orange.passive:hover,
  a.orange:hover,
  a.orange.passive:hover {
    opacity: 1;
    color: var(--ing-dark-blue);
    cursor: pointer;
  }
  button.orange.passive,
  a.orange.passive {
    opacity: 0.6;
  }
  button.orange path,
  a.orange path {
    fill: var(--ing-orange);
    transition: fill 0.3s ease;
  }
  button.orange:hover path,
  a.orange:hover path {
    fill: var(--ing-dark-blue);
  }
  button.orange[disabled] path,
  a.orange[disabled] path,
  button.orange[disabled] path,
  a.orange[disabled] path {
    fill: var(--dark-grey-bg);
  }

  button.secondary {
    min-height: 48px;
    font-size: 16px;
    color: var(--ing-purple);
    border: 2px solid var(--ing-purple);
    border-radius: var(--radius);
    background-color: transparent;
    transition: background-color 0.3s ease;
  }
  button.secondary:hover {
    cursor: pointer;
    background-color: var(--grey-bg);
  }

  button[type='submit'],
  input[type='submit'] {
    min-height: 48px;
    color: white;
    background-color: var(--ing-orange);
    font-size: 16px;
    border-radius: var(--radius);
    border: 0;
    transition: background-color 0.3s ease;
  }
  button[type='submit']:hover,
  input[type='submit']:hover {
    cursor: pointer;
    background-color: var(--ing-dark-blue);
  }

  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    padding: 64px 32px;
    opacity: .5;
  }
  .not-found svg {
    min-width: 150px;
    min-height: 150px;
  }
  .not-found h2 {
    text-align: center;
    font-size: 36px;
    font-weight: normal;
  }
`;

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(globalStyles.cssText);
document.adoptedStyleSheets = [styleSheet];

export default globalStyles;
