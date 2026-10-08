// The guest's Google photo, or their initials when there is none
function GuestAvatar({ user, size = "h-8 w-8 text-xs" }) {
  if (user.image)
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt={user.name}
        // Google profile photos only load without a referrer
        referrerPolicy="no-referrer"
        className={`${size} rounded-full object-cover`}
      />
    );

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={`${size} flex items-center justify-center rounded-full bg-sand-200 font-label font-semibold text-forest-900`}
    >
      {initials}
    </span>
  );
}

export default GuestAvatar;
