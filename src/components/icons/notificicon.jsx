function NotificationIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bell */}
      <path
        d="M18 16H6C6 16 7 14.5 7 11C7 8 9 6 12 6C15 6 17 8 17 11C17 14.5 18 16 18 16Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Clapper */}
      <path
        d="M10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default NotificationIcon;
