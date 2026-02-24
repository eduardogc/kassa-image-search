import { css } from '@emotion/css';
import { theme } from '../theme';

export const page = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 24px;
`;

export const container = css`
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: ${theme.surfaceLight};
  border: 1px solid ${theme.surfaceBorder};
  border-radius: ${theme.radius.xl};
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

export const title = css`
  text-align: center;
  font-size: 1.8rem;
  margin: 0;
  color: ${theme.text};
`;

export const subtitle = css`
  text-align: center;
  color: ${theme.textDim};
  margin: -16px 0 0 0;
`;

export const section = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const fieldLabel = css`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${theme.textDim};
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

export const textInput = css`
  background: ${theme.surfaceInput};
  border: 1px solid ${theme.surfaceInputBorder};
  border-radius: ${theme.radius.lg};
  padding: 12px 16px;
  color: ${theme.text};
  font-size: 0.9rem;
  transition: all 0.2s;
  outline: none;

  &:focus {
    border-color: ${theme.accent};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }
`;

export const searchBtn = css`
  padding: 14px;
  border-radius: ${theme.radius.xl};
  background: ${theme.accentGradient};
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const errorBanner = css`
  background: ${theme.redBg};
  border: 1px solid ${theme.redBorder};
  color: ${theme.red};
  padding: 12px 16px;
  border-radius: ${theme.radius.lg};
  font-size: 0.85rem;
  line-height: 1.4;
`;
