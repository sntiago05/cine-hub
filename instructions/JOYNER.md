# JOYNER - USUARIO

## RESPONSABILIDAD

Implementar favoritos y perfil.

---

# ARCHIVOS

src/pages/FavoritesPage.js

src/pages/ProfilePage.js

src/services/favorites.service.js

src/utils/session.js

---

# RUTAS

/favorites

/profile

---

# FAVORITOS

## Objetivo

Mostrar favoritos del usuario.

## Debe hacer

1. Obtener usuario actual
2. Obtener favoritos
3. Mostrar favoritos
4. Eliminar favoritos
5. Empty State

---

# JSON FAVORITOS

{
  "id": 1,
  "userId": 2,
  "showId": 101,
  "showName": "Dark",
  "image": "..."
}

---

# PROFILE

Mostrar

Nombre

Email

Rol

Botón Logout

---

# FAVORITES SERVICE

Implementar

getFavorites(userId)

addFavorite(show)

removeFavorite(id)

---

# SESSION

Implementar

getSession()

isAdmin()

isUser()

---

# TERMINADO CUANDO

✓ Perfil funciona

✓ Favoritos funcionan

✓ Puede eliminar favoritos