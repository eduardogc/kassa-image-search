import { css } from '@emotion/css';
import { theme } from '../theme';

export const page = css`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

export const container = css`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const header = css`
  h1 { font-size: 1.5rem; margin: 0 0 6px; }
`;

export const subtitle = css`
  color: ${theme.textDim};
  font-size: 0.9rem;
  margin: 0;
`;

export const configSection = css`
  background: ${theme.surfaceLight};
  border: 1px solid ${theme.surfaceBorder};
  border-radius: ${theme.radius.section};
  padding: 24px;

  h2 { font-size: 1.1rem; margin: 0 0 6px; color: ${theme.text}; }
`;

export const sectionDesc = css`
  font-size: 0.82rem;
  color: ${theme.textDim};
  margin: 0 0 20px;
  line-height: 1.5;
`;

export const weightSlider = css`
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  &:last-child { border-bottom: none; }
`;

export const weightHeader = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const weightLabel = css`
  font-weight: 600;
  font-size: 0.92rem;
`;

export const weightValue = css`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${theme.accent};
  background: rgba(99, 102, 241, 0.1);
  padding: 2px 10px;
  border-radius: ${theme.radius.sm};
  font-variant-numeric: tabular-nums;
`;

export const weightDesc = css`
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

export const paramRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  &:last-child { border-bottom: none; }
`;

export const paramInfo = css`
  label {
    font-weight: 600;
    font-size: 0.92rem;
    display: block;
  }
`;

export const paramDesc = css`
  font-size: 0.78rem;
  color: ${theme.textDim};
  display: block;
  margin-top: 2px;
`;

export const paramInput = css`
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

export const paramInputWide = css`
  ${paramInput};
  width: 280px;
  text-align: left;
`;

export const actions = css`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const saveBtn = css`
  padding: 12px 32px;
  border-radius: ${theme.radius.lg};
  background: ${theme.accentGradient};
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.25s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
  }

  &:disabled { opacity: 0.6; }
`;

export const errorText = css`
  color: ${theme.red};
  font-size: 0.85rem;
`;

export const loading = css`
  display: flex;
  justify-content: center;
  padding: 64px;
  color: ${theme.textDim};
`;
