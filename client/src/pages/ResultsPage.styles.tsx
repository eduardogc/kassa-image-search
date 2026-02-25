import { css, keyframes } from '@emotion/css';
import { theme } from '../theme';

export const page = css`
  display: flex;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  min-height: calc(100vh - 80px);

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const sidebar = css`
  width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 900px) {
    width: 100%;
  }
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

export const resultsArea = css`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const headerBar = css`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 24px;
`;

export const backBtn = css`
  background: transparent;
  border: 1px solid ${theme.surfaceBorder};
  border-radius: ${theme.radius.md};
  color: ${theme.textDim};
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.surfaceInput};
    color: ${theme.text};
  }
`;

export const resultsGrid = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

export const emptyState = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: ${theme.textDim};

  h2 {
    color: ${theme.text};
    margin: 0 0 8px;
    font-size: 1.3rem;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    max-width: 400px;
  }
`;

export const emptyIcon = css`
  font-size: 64px;
  margin-bottom: 16px;
  filter: grayscale(0.3);
`;

const spin = keyframes`to { transform: rotate(360deg); }`;

export const spinner = css`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

export const spinnerLarge = css`
  ${spinner};
  width: 48px;
  height: 48px;
  border-width: 3px;
  margin-bottom: 16px;
`;
