// ── Design tokens ──
// Centralized theme constants used across all emotion styles

export const theme = {
    bg: '#0f0f14',
    bgElevated: '#16161d',
    text: '#e8e8ed',
    textDim: '#7a7a8a',
    accent: '#6366f1',
    accentHover: '#818cf8',
    border: 'rgba(255, 255, 255, 0.08)',

    // Surfaces
    surfaceLight: 'rgba(255, 255, 255, 0.03)',
    surfaceHover: 'rgba(255, 255, 255, 0.05)',
    surfaceBorder: 'rgba(255, 255, 255, 0.08)',
    surfaceInput: 'rgba(255, 255, 255, 0.05)',
    surfaceInputBorder: 'rgba(255, 255, 255, 0.1)',

    // Semantic
    green: '#34d399',
    red: '#fca5a5',
    redBg: 'rgba(239, 68, 68, 0.1)',
    redBorder: 'rgba(239, 68, 68, 0.3)',

    // Badges
    categoryBg: 'rgba(99, 102, 241, 0.1)',
    categoryColor: '#a5b4fc',
    categoryBorder: 'rgba(99, 102, 241, 0.2)',
    typeBg: 'rgba(244, 114, 182, 0.1)',
    typeColor: '#f9a8d4',
    typeBorder: 'rgba(244, 114, 182, 0.2)',

    // Gradients
    accentGradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
    brandGradient: 'linear-gradient(135deg, #6366f1, #a78bfa)',
    scoreGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
    signalGradient: 'linear-gradient(90deg, #6366f1, #818cf8)',

    // Fonts
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

    // Radii
    radius: {
        sm: '6px',
        md: '8px',
        lg: '10px',
        xl: '12px',
        xxl: '14px',
        pill: '20px',
        section: '16px',
    },
} as const;
