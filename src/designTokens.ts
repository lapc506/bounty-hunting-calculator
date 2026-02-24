/**
 * Design Tokens - Paleta Uniforme
 * Dark: Azul Oscuro (#0F172A) + Morados
 * Light: Celestes Pastel
 */

// Paleta de Colores Coordinada
export const colorPalette = {
  // Dark Mode: Azul Oscuro + Morado
  dark: {
    background: '#0f172a',      // Base más oscura
    surface: '#1a2640',         // Superficies
    surfaceAlt: '#263345',      // Variación
    border: '#2d3f52',          // Bordes (OSCURO, no blanco)
    text: '#e8f1ff',            // Texto claro
    textMuted: '#a8b8d0',       // Texto secundario
    accent: '#7c5cef',          // Morado principal
    accentAlt: '#a78bfa',       // Morado pastel
    blue: '#3b82f6',            // Azul
  },
  // Light Mode: Celeste Pastel
  light: {
    background: '#f0f8ff',      // Fondo azul claro
    surface: '#ffffff',         // Superficies blancas
    surfaceAlt: '#e0f2fe',      // Variación celeste
    border: '#bae6fd',          // Bordes azul claro
    text: '#0f172a',            // Texto oscuro
    textMuted: '#64748b',       // Texto gris
    accent: '#0077b6',          // Azul oscuro
    accentAlt: '#00adee',       // Azul claro
    blue: '#3b82f6',            // Azul
  },
};

// Light mode semantic tokens
export const lightSemanticTokens = {
  background: colorPalette.light.background,
  surface: colorPalette.light.surface,
  surfaceAlt: colorPalette.light.surfaceAlt,
  border: colorPalette.light.border,
  text: colorPalette.light.text,
  textMuted: colorPalette.light.textMuted,
  accent: colorPalette.light.accent,
  accentAlt: colorPalette.light.accentAlt,
};

// Dark mode semantic tokens
export const darkSemanticTokens = {
  background: colorPalette.dark.background,
  surface: colorPalette.dark.surface,
  surfaceAlt: colorPalette.dark.surfaceAlt,
  border: colorPalette.dark.border,
  text: colorPalette.dark.text,
  textMuted: colorPalette.dark.textMuted,
  accent: colorPalette.dark.accent,
  accentAlt: colorPalette.dark.accentAlt,
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
