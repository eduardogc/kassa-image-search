import { css } from '@emotion/css';
import { theme } from '../theme';

export const wrapper = css`
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  &:last-child { border-bottom: none; }
`;

export const header = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const label = css`
  font-weight: 600;
  font-size: 0.92rem;
`;

export const value = css`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${theme.accent};
  background: rgba(99, 102, 241, 0.1);
  padding: 2px 10px;
  border-radius: ${theme.radius.sm};
  font-variant-numeric: tabular-nums;
`;

export const desc = css`
  font-size: 0.78rem;
  color: ${theme.textDim};
  margin: 4px 0 10px;
`;

export const slider = css`
  width: 100%;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${theme.accent};
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
    transition: transform 0.15s;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }
`;
