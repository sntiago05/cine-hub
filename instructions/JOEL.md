# JOEL - AUTENTICACIÓN

## RESPONSABILIDAD

Implementar todo el sistema de autenticación.

Tu trabajo permite:

- Iniciar sesión
- Registrarse
- Cerrar sesión
- Mantener sesión activa

---

# ARCHIVOS

src/pages/LoginPage.js

src/pages/RegisterPage.js

src/services/auth.service.js

src/utils/storage.js

src/utils/validators.js

---

# RUTAS

/login

/register

---

# LOGIN

## Objetivo

Permitir que un usuario existente ingrese al sistema.

## Debe hacer

1. Capturar email
2. Capturar password
3. Validar campos vacíos
4. Buscar usuario en JSON Server
5. Comparar contraseña
6. Guardar sesión en localStorage
7. Redirigir a "/"

## Ejemplo

Email:

admin@cinehub.com

Password:

123456

---

# REGISTER

## Objetivo

Crear usuarios nuevos.

## Debe hacer

1. Capturar nombre
2. Capturar email
3. Capturar contraseña
4. Validar datos
5. Verificar que el email no exista
6. Crear usuario

Role por defecto:

user

## Ejemplo JSON

{
  "name": "Pedro",
  "email": "pedro@gmail.com",
  "password": "123456",
  "role": "user"
}

---

# AUTH SERVICE

Implementar:

login(email,password)

register(user)

logout()

getCurrentUser()

---

# STORAGE

Guardar sesión:

localStorage

Clave:

session

Ejemplo:

{
  "id": 1,
  "name": "Admin",
  "email": "admin@cinehub.com",
  "role": "admin"
}

---

# NO MODIFICAR

router/

layouts/

main.js

---

# TERMINADO CUANDO

✓ Login funciona

✓ Register funciona

✓ Logout funciona

✓ Guarda sesión

✓ Mantiene sesión al recargar