/**
 * Design Tokens - Sistema centralizado de colores
 * Responde automáticamente a dark mode
 */

export const designTokens = {
  colors: {
    // Borders
    border: {
      light: '#e2e8f0',  // slate-200
      dark: '#334155',   // slate-700
    },
    // Backgrounds
    background: {
      light: {
        card: '#ffffff',
        secondary: '#f1f5f9',
      },
      dark: {
        card: '#1e293b',    // slate-800
        secondary: '#0f172a', // slate-900
      },
    },
    // Text
    text: {
      light: {
        primary: '#0f172a',
        secondary: '#64748b',
      },
      dark: {
        primary: '#f1f5f9',
        secondary: '#cbd5e1',
      },
    },
  },
};

/**
 * Retorna el color apropiado basado en dark mode
 * @param isDark - Estado de dark mode
 * @param lightColor - Color para light mode
 * @param darkColor - Color para dark mode
 */
export const getThemeColor = (isDark: boolean, lightColor: string, darkColor: string): string => {
  return isDark ? darkColor : lightColor;
};
