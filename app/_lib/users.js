// Small helpers about the signed-in person. No server or browser APIs here,
// so they can be used anywhere and tested on their own.

// Name and photo come from Google, or from the name typed at sign up
export function toGuestUser(user) {
  const details = user.user_metadata ?? {};

  return {
    id: user.id,
    email: user.email,
    name:
      details.full_name?.trim() ||
      details.name?.trim() ||
      user.email.split("@")[0],
    image: details.avatar_url || details.picture || null,
  };
}

// Where to go after signing in. Only a page of this site, so a crafted
// link can never send a guest somewhere else.
export function safeNextPath(next, fallback = "/account") {
  if (typeof next !== "string") return fallback;

  const isOwnPage =
    next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\");

  return isOwnPage ? next : fallback;
}
