// Auth Service - Servicios de autenticación

import { validateLoginForm, validateRegisterForm } from '../utils/validators';
import { saveSession, clearSession } from '../utils/storage';

const API_BASE = 'http://localhost:3000';

/**
 * Obtiene todos los usuarios de JSON Server
 */
const getUsers = async () => {
  try {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return await response.json();
  } catch (error) {
    console.error('Error en getUsers:', error);
    return [];
  }
};

/**
 * Busca un usuario por email
 */
const getUserByEmail = async (email) => {
  try {
    const users = await getUsers();
    return users.find(user => user.email === email);
  } catch (error) {
    console.error('Error en getUserByEmail:', error);
    return null;
  }
};

/**
 * Autentica un usuario (Login)
 */
export const login = async (email, password) => {
  try {
    // Validar campos
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    // Buscar usuario por email
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Comparar contraseña
    if (user.password !== password) {
      return { success: false, error: 'Contraseña incorrecta' };
    }

    // Guardar sesión
    saveSession(user);

    return { success: true, user };
  } catch (error) {
    console.error('Error en login:', error);
    return { success: false, error: 'Error al iniciar sesión' };
  }
};

/**
 * Registra un nuevo usuario
 */
export const register = async (name, email, password, confirmPassword) => {
  try {
    // Validar campos
    const validation = validateRegisterForm(name, email, password, confirmPassword);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    // Verificar si el usuario ya existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { success: false, error: 'Este correo ya está registrado' };
    }

    // Crear nuevo usuario
    const newUser = {
      name: name.trim(),
      email: email.trim(),
      password: password,
      role: 'user'
    };

    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    if (!response.ok) throw new Error('Error al registrar usuario');

    const createdUser = await response.json();

    // Guardar sesión automáticamente después del registro
    saveSession(createdUser);

    return { success: true, user: createdUser };
  } catch (error) {
    console.error('Error en register:', error);
    return { success: false, error: 'Error al registrarse' };
  }
};

/**
 * Cierra sesión del usuario
 */
export const logout = () => {
  try {
    clearSession();
    return { success: true };
  } catch (error) {
    console.error('Error en logout:', error);
    return { success: false, error: 'Error al cerrar sesión' };
  }
};

// Exportar el servicio completo
export const authService = {
  login,
  register,
  logout,
  getUsers,
  getUserByEmail
};
