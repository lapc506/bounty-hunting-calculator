/**
 * Design Tokens - Sistema centralizado de colores
 * Material Design 3 Baseline Color Scheme basado en #0F172A
 * Responde automáticamente a dark mode
 */

// Material Design 3 Color Tokens
export const md3Colors = {
  primary: {
    0: '#000000',
    10: '#001f3a',
    20: '#003355',
    25: '#003d63',
    30: '#004872',
    35: '#005382',
    40: '#005e92',
    50: '#0077b6',
    60: '#0091d0',
    70: '#00adee',
    80: '#36c9ff',
    90: '#8fffff',
    95: '#b3ffff',
    99: '#f3ffff',
    100: '#ffffff',
  },
  secondary: {
    0: '#000000',
    10: '#1a2a3a',
    20: '#2c3f50',
    25: '#364a5d',
    30: '#41556a',
    35: '#4c6076',
    40: '#586b82',
    50: '#6f7a8f',
    60: '#8a8fa0',
    70: '#a5aab5',
    80: '#c1c7d0',
    90: '#dde1eb',
    95: '#ebeef7',
    99: '#fafbff',
    100: '#ffffff',
  },
  tertiary: {
    0: '#000000',
    10: '#2a1a2a',
    20: '#402a40',
    25: '#4d354d',
    30: '#5a405a',
    35: '#674b67',
    40: '#755675',
    50: '#8e6b8e',
    60: '#a882a8',
    70: '#c39ac3',
    80: '#dfb3df',
    90: '#fac3ff',
    95: '#ffd7ff',
    99: '#fffbfe',
    100: '#ffffff',
  },
  neutral: {
    0: '#000000',
    10: '#191c1f',
    20: '#2d3134',
    25: '#383c40',
    30: '#43474b',
    35: '#4f5357',
    40: '#5a5e62',
    50: '#72767b',
    60: '#8b9094',
    70: '#a5aaaf',
    80: '#c0c5ca',
    90: '#dce1e6',
    95: '#eef0f5',
    99: '#fffbfe',
    100: '#ffffff',
  },
};

// Light mode semantic tokens
export const lightSemanticTokens = {
  primary: md3Colors.primary[40],
  onPrimary: md3Colors.primary[100],
  primaryContainer: md3Colors.primary[90],
  onPrimaryContainer: md3Colors.primary[10],
  secondary: md3Colors.secondary[40],
  onSecondary: md3Colors.secondary[100],
  secondaryContainer: md3Colors.secondary[90],
  onSecondaryContainer: md3Colors.secondary[10],
  tertiary: md3Colors.tertiary[40],
  onTertiary: md3Colors.tertiary[100],
  tertiaryContainer: md3Colors.tertiary[90],
  onTertiaryContainer: md3Colors.tertiary[10],
  background: md3Colors.neutral[99],
  onBackground: md3Colors.neutral[10],
  surface: md3Colors.neutral[99],
  onSurface: md3Colors.neutral[10],
  surfaceVariant: md3Colors.neutral[90],
  onSurfaceVariant: md3Colors.neutral[30],
  outline: md3Colors.neutral[50],
  outlineVariant: md3Colors.neutral[80],
};

// Dark mode semantic tokens
export const darkSemanticTokens = {
  primary: md3Colors.primary[80],
  onPrimary: md3Colors.primary[20],
  primaryContainer: md3Colors.primary[30],
  onPrimaryContainer: md3Colors.primary[90],
  secondary: md3Colors.secondary[80],
  onSecondary: md3Colors.secondary[20],
  secondaryContainer: md3Colors.secondary[30],
  onSecondaryContainer: md3Colors.secondary[90],
  tertiary: md3Colors.tertiary[80],
  onTertiary: md3Colors.tertiary[20],
  tertiaryContainer: md3Colors.tertiary[30],
  onTertiaryContainer: md3Colors.tertiary[90],
  background: md3Colors.neutral[10],
  onBackground: md3Colors.neutral[90],
  surface: md3Colors.neutral[10],
  onSurface: md3Colors.neutral[90],
  surfaceVariant: md3Colors.neutral[30],
  onSurfaceVariant: md3Colors.neutral[80],
  outline: md3Colors.neutral[60],
  outlineVariant: md3Colors.neutral[30],
};

export const designTokens = {
  colors: {
    light: lightSemanticTokens,
    dark: darkSemanticTokens,
  },
};

/**
 * Retorna el color semántico apropiado basado en dark mode
 * @param isDark - Estado de dark mode
 * @param tokenName - Nombre del token semántico (ej: 'primary', 'background', 'onSurface')
 */
export const getSemanticColor = (isDark: boolean, tokenName: keyof typeof lightSemanticTokens): string => {
  return isDark ? darkSemanticTokens[tokenName] : lightSemanticTokens[tokenName];
};

/**
 * Retorna el color apropiado basado en dark mode (legacy)
 * @param isDark - Estado de dark mode
 * @param lightColor - Color para light mode
 * @param darkColor - Color para dark mode
 */
export const getThemeColor = (isDark: boolean, lightColor: string, darkColor: string): string => {
  return isDark ? darkColor : lightColor;
};
