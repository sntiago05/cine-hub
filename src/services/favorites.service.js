const API_URL = "http://localhost:3000/favorites";

export const getFavorites = async (userId) => {
  const response = await fetch(
    `${API_URL}?userId=${userId}`
  );

  return response.json();
};

export const addFavorite = async (favorite) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(favorite)
  });

  return response.json();
};

export const removeFavorite = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
};