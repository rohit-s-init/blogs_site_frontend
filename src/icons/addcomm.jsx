import { useAuth } from "../context/UserContext";

function AddCommunityIcon({ size = 24, color = "currentColor" }) {
  const { theme } = useAuth();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={theme == "dark" ? { color: "white" } : {}}

    >
      {/* Main User */}
      <path
        d="M9 11C10.6569 11 12 9.65685 12 8C12 6.34315 10.6569 5 9 5C7.34315 5 6 6.34315 6 8C6 9.65685 7.34315 11 9 11Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M4 19C4 16.7909 6.23858 15 9 15C11.7614 15 14 16.7909 14 19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Plus Symbol */}
      <path
        d="M17 10V16M14 13H20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default AddCommunityIcon;
