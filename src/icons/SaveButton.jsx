import styles from "../components/posts/posts.module.css";
import { useAuth } from "../context/UserContext";

export function SaveButton({ saved, onClick }) {
    const { theme } = useAuth();
    return (
        <div className={styles.actionItem} style={theme == "dark" ? { background: "#48484b", color: "#c9c4c4" } : {}} onClick={onClick}>
            {saved ? (
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="18"
                    height="18"
                >
                    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                </svg>
            ) : (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    width="18"
                    height="18"
                >
                    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                </svg>
            )}
        </div>
    );
}
