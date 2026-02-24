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

export const nav = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  background: ${theme.bgElevated};
  border-bottom: 1px solid ${theme.border};
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
`;

export const brand = css`
  font-size: 1.2rem;
  font-weight: 800;
  background: ${theme.brandGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
`;

export const navLinks = css`
  display: flex;
  gap: 4px;
`;

export const navLink = css`
  padding: 8px 16px;
  border-radius: ${theme.radius.md};
  color: ${theme.textDim};
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    color: ${theme.text};
    background: ${theme.surfaceHover};
  }
`;

export const navLinkActive = css`
  ${navLink};
  color: ${theme.accent};
  background: rgba(99, 102, 241, 0.1);
`;
