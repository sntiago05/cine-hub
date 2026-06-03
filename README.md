# Cine Hub

Cine Hub es una SPA creada con Vite, Tailwind CSS y JSON Server para explorar series, guardar favoritos y administrar contenido del sitio.

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

```bash
npm install
```

## Ejecución

Levanta la API local con JSON Server:

```bash
npm run server
```

En otra terminal, levanta la aplicación:

```bash
npm run dev
```

La API queda disponible en `http://localhost:3000` y Vite mostrará la URL local de la app en la terminal.

## Scripts

- `npm run dev`: inicia el servidor de desarrollo de Vite.
- `npm run build`: genera la versión de producción en `dist`.
- `npm run preview`: sirve la build de producción localmente.
- `npm run server`: inicia JSON Server usando `src/data/db.json`.

## Credenciales demo

- Admin: `a@a.com` / `asdasd`
- Usuario: `user@cinehub.com` / `123456`

## Funcionalidades

- Registro e inicio de sesión con roles.
- Búsqueda de series usando TVMaze.
- Detalle de series.
- Favoritos por usuario.
- Noticias públicas.
- Panel admin con métricas, categorías, noticias y gestión de usuarios.
- Cambio de rol y eliminación de usuarios desde el panel admin.

## Estructura

- `src/pages`: vistas principales de la aplicación.
- `src/services`: comunicación con JSON Server y APIs externas.
- `src/components`: componentes reutilizables.
- `src/router`: configuración de rutas y protección por rol.
- `src/data/db.json`: base de datos local para JSON Server.

## Notas

JSON Server guarda los cambios directamente en `src/data/db.json`. Si modificas usuarios, noticias, categorías o favoritos desde la app, esos datos quedarán persistidos en ese archivo.
