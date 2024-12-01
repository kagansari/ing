import {css} from 'lit';

const globalStyles = css`
  :root {
    --grey-bg: rgb(247, 247, 247);
    --dark-grey-bg: rgb(216, 216, 216);
    --text-secondary: rgb(124, 124, 124);
    --radius: 8px;
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
`;

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(globalStyles.cssText);
document.adoptedStyleSheets = [styleSheet];

export default globalStyles;
