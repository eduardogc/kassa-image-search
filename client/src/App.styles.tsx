import { css, injectGlobal } from '@emotion/css';
import { theme } from './theme';

export const initGlobalStyles = () => injectGlobal`
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: ${theme.bg};
    color: ${theme.text};
    font-family: ${theme.fontFamily};
    -webkit-font-smoothing: antialiased;
  }
`;

export const app = css`
  min-height: 100vh;
`;

