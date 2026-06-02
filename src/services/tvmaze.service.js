const API_BASE = 'https://api.tvmaze.com';

/**
 * Busca series por query en TVMaze API
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} - Array de series encontradas
 */
export const searchShows = async (query) => {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(`${API_BASE}/search/shows?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    return data.map(item => item.show);
  } catch (error) {
    console.error('Error searching shows:', error);
    throw error;
  }
};

/**
 * Obtiene el detalle de una serie por ID
 * @param {number} id - ID de la serie
 * @returns {Promise<Object>} - Objeto con los datos de la serie
 */
export const getShowById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/shows/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching show:', error);
    throw error;
  }
};

export const tvmazeService = {
  searchShows,
  getShowById
};
