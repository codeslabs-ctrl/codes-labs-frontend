# Codes-Labs - Angular Project

Este es un proyecto Angular moderno creado siguiendo las mejores prácticas, migrado desde una aplicación React.

## 🚀 Características

- **Angular Standalone Components**: Arquitectura moderna sin módulos
- **Tailwind CSS**: Estilos modernos y responsive
- **TypeScript Strict Mode**: Código type-safe
- **Routing**: Navegación con Angular Router
- **Componentes UI**: Button, Card, Badge con estilos personalizados
- **Lucide Icons**: Iconos modernos y consistentes

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          # Componente principal del dashboard
│   │   └── ui/                # Componentes UI reutilizables
│   │       ├── button/
│   │       ├── card/
│   │       └── badge/
│   ├── pages/
│   │   ├── index/             # Página principal
│   │   ├── about/             # Página "Acerca de"
│   │   └── not-found/          # Página 404
│   ├── lib/
│   │   └── utils.ts           # Utilidades (cn function)
│   └── app.component.ts       # Componente raíz
├── assets/                    # Archivos estáticos
└── styles.scss                # Estilos globales con Tailwind
```

## 🛠️ Tecnologías Utilizadas

- **Angular**: Framework principal
- **Tailwind CSS**: Framework de estilos
- **Lucide Angular**: Librería de iconos
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva

## 📦 Instalación

```bash
npm install
```

## 🚀 Desarrollo

```bash
npm start
# o
ng serve
```

El proyecto se ejecutará en `http://localhost:4200`

## 🏗️ Build

```bash
npm run build
# o
ng build
```

## ✅ Mejores Prácticas Implementadas

1. **Standalone Components**: Sin módulos, mejor tree-shaking
2. **TypeScript Strict**: Type safety completo
3. **Componentes Reutilizables**: UI components en carpeta dedicada
4. **Separación de Concerns**: Pages, Components, Services bien organizados
5. **Tailwind CSS**: Estilos consistentes y mantenibles
6. **Routing Centralizado**: Configuración de rutas en un solo archivo
7. **Código Limpio**: Interfaces TypeScript bien definidas

## 📝 Notas

- Este proyecto usa Angular 13. Para características más avanzadas (standalone components), considera actualizar a Angular 14+.
- Los estilos están configurados con variables CSS personalizadas para mantener consistencia con el diseño original.
- Los iconos de Lucide se importan individualmente para optimizar el bundle size.
"# codes-labs-frontend" 
