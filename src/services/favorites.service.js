const API_URL = "http://localhost:3000/favorites";

export const getFavorites = async (userId) => {
  const response = await fetch(
    `${API_URL}?userId=${userId}`
  );

  if (!response.ok) throw new Error("Error al cargar favoritos");
  return response.json();
};

export const getFavoriteByShow = async (userId, showId) => {
  const response = await fetch(`${API_URL}?userId=${userId}&showId=${showId}`);
  if (!response.ok) throw new Error("Error al validar favorito");
  const favorites = await response.json();
  return favorites[0] ?? null;
};

export const addFavorite = async (favorite) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(favorite)
  });

  if (!response.ok) throw new Error("Error al agregar favorito");
  return response.json();
};

export const removeFavorite = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  if (!response.ok) throw new Error("Error al eliminar favorito");
};

export const countFavorites = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al contar favoritos");
  const favorites = await response.json();
  return favorites.length;
};
