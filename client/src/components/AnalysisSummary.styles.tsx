import { css } from '@emotion/css';
import { theme } from '../theme';

export const analysisSummary = css`
  background: ${theme.surfaceLight};
  border: 1px solid ${theme.surfaceBorder};
  border-radius: ${theme.radius.xl};
  padding: 16px;

  h4 {
    margin: 0 0 12px;
    font-size: 0.82rem;
    font-weight: 600;
    color: ${theme.accent};
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
`;

export const analysisGrid = css`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 6px 12px;
  font-size: 0.82rem;
`;

export const analysisLabel = css`color: ${theme.textDim};`;
export const analysisValue = css`color: ${theme.text}; font-weight: 500;`;

export const metaInfo = css`
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.75rem;
  color: ${theme.textDim};
`;
