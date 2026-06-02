// ============================================
// Storage - Gestión de localStorage
// ============================================

/**
 * Guarda sesión en localStorage
 */
export const saveSession = (user) => {
  try {
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('session', JSON.stringify(session));
    return true;
  } catch (error) {
    console.error('Error guardando sesión:', error);
    return false;
  }
};

/**
 * Obtiene la sesión actual
 */
export const getSession = () => {
  try {
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error obteniendo sesión:', error);
    return null;
  }
};

/**
 * Elimina la sesión
 */
export const clearSession = () => {
  try {
    localStorage.removeItem('session');
    return true;
  } catch (error) {
    console.error('Error eliminando sesión:', error);
    return false;
  }
};

/**
 * Verifica si hay sesión activa
 */
export const isAuthenticated = () => {
  return getSession() !== null;
};


export const getUserRole = () => {
  const session = getSession();
  return session?.role || "guest";
};