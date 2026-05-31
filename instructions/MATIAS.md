# MATIAS - ADMIN

## RESPONSABILIDAD

Implementar panel administrativo.

---

# ARCHIVOS

src/pages/AdminDashboard.js

src/pages/AdminUsers.js

src/pages/AdminNews.js

src/pages/AdminCategories.js

src/services/users.service.js

src/services/news.service.js

src/services/categories.service.js

src/components/StatsCard.js

---

# RUTAS

/admin

/admin/users

/admin/news

/admin/categories

---

# DASHBOARD

Mostrar:

Cantidad usuarios

Cantidad favoritos

Cantidad noticias

Cantidad categorías

---

# USUARIOS

Mostrar tabla:

Nombre

Email

Rol

---

# NOTICIAS

CRUD COMPLETO

Crear

Editar

Eliminar

Listar

---

# ESTRUCTURA

{
  "id": 1,
  "title": "Nueva serie",
  "content": "Texto noticia"
}

---

# CATEGORÍAS

CRUD COMPLETO

Crear

Editar

Eliminar

Listar

---

# ESTRUCTURA

{
  "id": 1,
  "name": "Drama"
}

---

# SERVICES

users.service.js

getUsers()

getUserById()

updateUser()

deleteUser()

---

news.service.js

getNews()

createNews()

updateNews()

deleteNews()

---

categories.service.js

getCategories()

createCategory()

updateCategory()

deleteCategory()

---

# TERMINADO CUANDO

✓ Dashboard funciona

✓ Usuarios listan

✓ Noticias CRUD completo

✓ Categorías CRUD completo