import { css } from '@emotion/css';
import { theme } from '../theme';

export const base = css`
  border: 2px dashed rgba(255, 255, 255, 0.15);
  border-radius: ${theme.radius.section};
  background: ${theme.surfaceLight};
  transition: all 0.25s ease;
  cursor: pointer;
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: ${theme.accent};
    background: rgba(99, 102, 241, 0.06);
  }
`;

export const dragging = css`
  border-color: ${theme.accent};
  background: rgba(99, 102, 241, 0.06);
`;

export const disabled = css`
  opacity: 0.5;
  pointer-events: none;
`;

export const prompt = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 32px;
  width: 100%;
`;

export const icon = css`
  font-size: 48px;
  margin-bottom: 8px;
  filter: grayscale(0.3);
`;

export const title = css`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${theme.text};
`;

export const subtitle = css`
  font-size: 0.85rem;
  color: ${theme.textDim};
`;

export const previewContainer = css`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
`;

export const previewImage = css`
  max-height: 300px;
  max-width: 100%;
  object-fit: contain;
  border-radius: ${theme.radius.xl};
`;

export const changeBtn = css`
  margin-top: 12px;
  padding: 8px 20px;
  border-radius: ${theme.radius.md};
  background: rgba(255, 255, 255, 0.08);
  color: ${theme.textDim};
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${theme.surfaceInputBorder};

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: ${theme.text};
  }
`;
