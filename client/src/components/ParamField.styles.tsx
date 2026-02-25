import { css } from '@emotion/css';
import { theme } from '../theme';

export const row = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  &:last-child { border-bottom: none; }
`;

export const info = css`
  label {
    font-weight: 600;
    font-size: 0.92rem;
    display: block;
  }
`;

export const desc = css`
  font-size: 0.78rem;
  color: ${theme.textDim};
  display: block;
  margin-top: 2px;
`;

export const input = css`
  background: ${theme.surfaceInput};
  border: 1px solid ${theme.surfaceInputBorder};
  border-radius: ${theme.radius.md};
  padding: 8px 12px;
  color: ${theme.text};
  font-size: 0.85rem;
  width: 100px;
  text-align: center;
  outline: none;
  &:focus { border-color: ${theme.accent}; }
`;

export const inputWide = css`
  ${input};
  width: 280px;
  text-align: left;
`;
