// import styles from "./Home.module.css";
import styles from "../pages/Home.module.css";

export function SearchFilter({ onChange, active, setActive }) {

  const handleClick = (type) => {
    setActive(type);
    console.log("Selected:", type);
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.btn} ${active === "posts" ? styles.active : ""}`}
        onClick={() => handleClick("posts")}
      >
        Posts
      </button>

      <button
        className={`${styles.btn} ${active === "users" ? styles.active : ""}`}
        onClick={() => handleClick("users")}
      >
        Users
      </button>

      <button
        className={`${styles.btn} ${active === "groups" ? styles.active : ""}`}
        onClick={() => handleClick("groups")}
      >
        Groups
      </button>
    </div>
  );
}
