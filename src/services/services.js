// ============================================
// Auth Service - Gestión de autenticación
// ============================================

const API_BASE = 'http://localhost:3000';

/**
 * Obtiene todos los usuarios de la API
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
 * Valida campos del formulario
 */
const validateLoginForm = (email, password) => {
  const errors = {};

  if (!email || email.trim() === '') {
    errors.email = 'El correo es requerido';
  } else if (!email.includes('@')) {
    errors.email = 'Ingresa un correo válido';
  }

  if (!password || password.trim() === '') {
    errors.password = 'La contraseña es requerida';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * Autentica un usuario
 */
const login = async (email, password) => {
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

    // Guardar sesión en localStorage
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('session', JSON.stringify(session));

    return { success: true, user: session };
  } catch (error) {
    console.error('Error en login:', error);
    return { success: false, error: 'Error al iniciar sesión' };
  }
};

/**
 * Obtiene la sesión actual del usuario
 */
const getSession = () => {
  try {
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error al obtener sesión:', error);
    return null;
  }
};

/**
 * Verifica si el usuario está autenticado
 */
const isAuthenticated = () => {
  return getSession() !== null;
};

/**
 * Cierra sesión del usuario
 */
const logout = () => {
  try {
    localStorage.removeItem('session');
    return { success: true };
  } catch (error) {
    console.error('Error en logout:', error);
    return { success: false, error: 'Error al cerrar sesión' };
  }
};

// Exportar el servicio de autenticación
export const authService = {
  getUsers,
  getUserByEmail,
  validateLoginForm,
  login,
  getSession,
  isAuthenticated,
  logout
};
