export const getSession = () => {
  const session = localStorage.getItem("session");

  return session ? JSON.parse(session) : null;
};

export const isAdmin = () => {
  const user = getSession();

  return user?.role === "admin";
};

export const isUser = () => {
  const user = getSession();

  return user?.role === "user";
};