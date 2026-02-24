import { css } from '@emotion/css';
import { theme } from '../theme';

export const card = css`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${theme.surfaceBorder};
  border-radius: ${theme.radius.xxl};
  overflow: hidden;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: rgba(99, 102, 241, 0.3);
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-2px);
  }
`;

export const thumbnail = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

export const thumbnailEmoji = css`
  font-size: 4rem;
  filter: saturate(0.8);
  opacity: 0.85;
`;

export const cardBody = css`
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const header = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const rank = css`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${theme.accent};
  background: rgba(99, 102, 241, 0.25);
  backdrop-filter: blur(8px);
  padding: 3px 10px;
  border-radius: ${theme.radius.sm};
`;

export const score = css`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${theme.text};
  background: ${theme.scoreGradient};
  backdrop-filter: blur(8px);
  padding: 3px 10px;
  border-radius: ${theme.radius.sm};
`;

export const title = css`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.text};
  margin: 0;
  line-height: 1.3;
`;

export const description = css`
  font-size: 0.82rem;
  color: ${theme.textDim};
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const meta = css`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const badgeBase = css`
  font-size: 0.72rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: ${theme.radius.pill};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const categoryBadge = css`
  ${badgeBase};
  background: ${theme.categoryBg};
  color: ${theme.categoryColor};
  border: 1px solid ${theme.categoryBorder};
`;

export const typeBadge = css`
  ${badgeBase};
  background: ${theme.typeBg};
  color: ${theme.typeColor};
  border: 1px solid ${theme.typeBorder};
`;

export const details = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const price = css`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${theme.green};
`;

export const dimensions = css`
  font-size: 0.78rem;
  color: ${theme.textDim};
`;

export const signalBars = css`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

export const signalBar = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const signalLabel = css`
  font-size: 0.7rem;
  color: ${theme.textDim};
  width: 56px;
  flex-shrink: 0;
`;

export const signalTrack = css`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  overflow: hidden;
`;

export const signalFill = css`
  height: 100%;
  background: ${theme.signalGradient};
  border-radius: 2px;
  transition: width 0.4s ease;
`;
