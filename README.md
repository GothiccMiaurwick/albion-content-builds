# ⚔️ Albion Online Content Builds

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055?style=for-the-badge&logo=framer)

Una herramienta premium e interactiva diseñada para la gestión y visualización de builds de **Albion Online**. Este proyecto permite a los líderes de gremio y jugadores organizar equipamientos para diferentes tipos de contenido con una interfaz moderna y optimizada.

---

## ✨ Características Principales

- **🧙 Editor de Builds Interactivo**: Crea y modifica builds en tiempo real con una interfaz visual intuitiva.
- **🔍 Búsqueda Inteligente**: Motor de búsqueda con soporte para nombres aproximados, tiers (ej: `t4.1`, `espada t8`) y multilingüe (Español/Inglés).
- **🚀 Máximo Rendimiento**: 
  - Optimización de imágenes con `next/image` y carga prioritaria para reducir el LCP.
  - Carga diferida (Lazy Loading) de componentes pesados para un inicio instantáneo.
- **🌌 Estética Premium**: Fondo celestial dinámico y diseño basado en *glassmorphism* con acentos dorados.
- **🐟 Base de Datos Completa**: Incluye todos los objetos, desde equipo de combate hasta la colección completa de peces (T1-T8).
- **🎨 Temas Personalizados**: Selector visual de colores y roles para una organización clara.

---

## 🛠️ Tecnologías

Este proyecto utiliza lo último en desarrollo web moderno:

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Gestión de Paquetes**: [pnpm](https://pnpm.io/)

---

## 🚀 Instalación y Uso

### Prerrequisitos

- **Node.js**: v18.0.0 o superior
- **pnpm**: Recomendado

### Pasos

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/GothiccMiaurwick/albion-content-builds.git
   cd albion-content-builds
   ```

2. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

3. **Iniciar servidor de desarrollo**:
   ```bash
   pnpm dev
   ```

4. **Acceder a la aplicación**:
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📁 Estructura del Proyecto

- `/app`: Rutas y lógica principal (Next.js App Router).
- `/app/components`: Componentes modulares y reutilizables.
- `/app/api`: Endpoints de búsqueda y gestión de contenido.
- `/app/data`: Bases de datos locales (`items.json` y `content.json`).

---

## 👤 Autor

**Miaurwick**
- [GitHub](https://github.com/GothiccMiaurwick)
- [X (Twitter)](https://x.com/MIAURWICK)

---

Developed with ❤️ for the Albion Online community.
