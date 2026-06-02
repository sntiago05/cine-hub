// ============================================
// Validators - Funciones de validación
// ============================================

/**
 * Valida formato de email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida campos del login
 */
export const validateLoginForm = (email, password) => {
  const errors = {};

  if (!email || email.trim() === '') {
    errors.email = 'El correo es requerido';
  } else if (!validateEmail(email)) {
    errors.email = 'Ingresa un correo válido';
  }

  if (!password || password.trim() === '') {
    errors.password = 'La contraseña es requerida';
  } else if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * Valida campos del registro
 */
export const validateRegisterForm = (name, email, password, confirmPassword) => {
  const errors = {};

  if (!name || name.trim() === '') {
    errors.name = 'El nombre es requerido';
  } else if (name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres';
  }

  if (!email || email.trim() === '') {
    errors.email = 'El correo es requerido';
  } else if (!validateEmail(email)) {
    errors.email = 'Ingresa un correo válido';
  }

  if (!password || password.trim() === '') {
    errors.password = 'La contraseña es requerida';
  } else if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};
