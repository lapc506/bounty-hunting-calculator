# Bounty Hunting Calculator

Calculadora de valuación para bounties atómicos con pago diferido. ¿Cómo le paga una startup a sus early employees sin ceder equity? Esta calculadora responde a esa pregunta.

Una app TypeScript + React con Vite, desplegable estáticamente en GitHub Pages.

## 🚀 Características

- **Cálculo automático de deuda:** Valúa hitos atómicos en modo artesanal o agéntico
- **Proyección visual:** Gráfico de área que muestra la evolución de la deuda en el tiempo
- **Markup de riesgo:** Configurable y retroalimentado en el cálculo final
- **Interés compuesto**: Cálculo semanal de interés basado en tasa mensual
- **Draft contractual:** Generador automático de claúsulas con copy-to-clipboard
- **Pool dinámico:** Agrega, edita y elimina bounties en tiempo real
- **Modo Agéntico:** Multiplica eficiencia por factor configurable

## 📋 Requisitos

- Node.js 18+ (npm 9+)
- Git

## 🛠️ Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/lapc506/bounty-hunting-calculator.git
cd bounty-hunting-calculator

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (http://localhost:5173)
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 🚀 Despliegue en GitHub Pages

### 1. Habilitación automática (recomendado)

El archivo `.github/workflows/deploy.yml` está configurado para desplegar automáticamente:

- Cada push a `main` se construye y despliega automáticamente
- No requiere configuración adicional

### 2. Configuración de GitHub Pages (una sola vez)

1. Ve a **Settings → Pages** en tu repositorio
2. En "Build and deployment", selecciona:
   - **Source:** GitHub Actions
   - (La configuración de rama se maneja automáticamente)
3. Guarda los cambios

### 3. Verificar el despliegue

- Ve a **Actions** en el repositorio
- Verifica que el workflow `Deploy to GitHub Pages` ejecutó exitosamente
- Tu app estará disponible en: `https://<username>.github.io/bounty-hunting-calculator/`

## 📁 Estructura del Proyecto

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml           # Workflow de CI/CD para GitHub Pages
├── src/
│   ├── main.tsx                 # Punto de entrada React
│   ├── App.tsx                  # Componente principal
│   └── index.css                # Estilos Tailwind
├── index.html                   # HTML del sitio
├── package.json                 # Dependencias y scripts
├── vite.config.ts              # Configuración de Vite
├── tsconfig.json               # Configuración de TypeScript
├── tailwind.config.js          # Configuración de Tailwind CSS
├── postcss.config.js           # Configuración de PostCSS
├── .gitignore                  # Archivos ignorados por Git
└── README.md                   # Este archivo
```

## 🔧 Tecnologías

- **React 18** - Framework UI
- **TypeScript** - Lenguaje
- **Vite** - Build tool
- **Tailwind CSS** - Utilidades CSS
- **Recharts** - Gráficos
- **Lucide React** - Iconos
- **GitHub Pages** - Hosting estático

## 📝 Variables de Entorno

No requiere variables de entorno. Toda la configuración se maneja en el UI.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia especificada en el archivo [LICENSE](LICENSE).

## ⚠️ Disclaimer

Esta calculadora es una herramienta informativa. Los cálculos de deuda, interés y valuación no constituyen asesoría legal o financiera. Consulta con profesionales antes de firmar contratos.

---

Desarrollado con ❤️ por la comunidad de hunters
