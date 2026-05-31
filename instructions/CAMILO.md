# CAMILO - SERIES Y API

## RESPONSABILIDAD

Implementar búsqueda y detalle de series.

---

# ARCHIVOS

src/pages/HomePage.js

src/pages/ShowDetailsPage.js

src/components/SearchBar.js

src/components/ShowCard.js

src/services/tvmaze.service.js

---

# RUTAS

/

/show/:id

---

# API

TVMaze

https://api.tvmaze.com

---

# HOMEPAGE

## Objetivo

Permitir buscar series.

## Debe hacer

1. Mostrar SearchBar
2. Capturar búsqueda
3. Consumir API
4. Mostrar resultados
5. Mostrar Loading
6. Mostrar EmptyState

---

# SHOWCARD

## Mostrar

Imagen

Nombre

Rating

Botón Ver

Botón Favorito

---

# DETALLE

## Ruta

/show/:id

## Mostrar

Imagen grande

Nombre

Géneros

Rating

Resumen

Botón Agregar Favorito

---

# TVMAZE SERVICE

Implementar

searchShows(query)

getShowById(id)

---

# TERMINADO CUANDO

✓ Busca series

✓ Muestra resultados

✓ Muestra detalle

✓ Consume API correctamente