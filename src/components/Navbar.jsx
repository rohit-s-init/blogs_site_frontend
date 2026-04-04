import styles from "./navbar.module.css";
import logo from "../assets/logo.png";
import AddCommunityIcon from "../icons/addcomm";
import NotificationIcon from "../icons/notificicon";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/UserContext";
import { logout as logout_user } from "../services/authservices";

function Navbar({ search, updateSearch, setCommWindow }) {
  const navigate = useNavigate();
  const { user, updateUser, theme, updateTheme } = useContext(AuthContext);

  const [isDark, setIsDark] = useState(false);

  const logout = async () => {
    await logout_user();
    updateUser(null);
    navigate("/");
  };

  const toggleMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);

    if (newMode) {
      console.log("dark");
    } else {
      console.log("light");
    }

    if (theme == "light") {
      updateTheme("dark");
    }
    else {
      updateTheme("light")
    }

  };

  return (
    <header className={styles.header} style={{ borderBottom: "1px solid white", backgroundColor: theme == "dark" ? "black" : "", zIndex: "100" }}>
      {/* LEFT */}
      <div
        className={styles.left}
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="HiveMind" className={styles.logo} />
        {/* <img
          src={post}
          alt="community"
          className={styles.communityAvatar}
        /> */}
        <span className={styles.brand} style={{color: "#ff0000"}}>hivemind</span>
      </div>

      {/* SEARCH */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Find anything"
          className={styles.search}
          onChange={(event) => {
            updateSearch(event.target.value);
          }}
          style={theme=="dark"?{background: "black"}:{}}
        />
      </div>

      {/* RIGHT */}
      <div className={styles.right}>

        {!user && (
          <button
            className={styles.loginBtn}
            onClick={() => navigate("/login")}
            style={theme=="dark"?{color: "white"}:{}}
          >
            Login
          </button>
        )}

        {user && (
          <>
            {/* Create Post */}
            {/* <div className={styles.iconWrapper}>
              <span onClick={() => navigate("/createpost")}>
                <AddPostIcon />
              </span>
              <div className={styles.tooltip}>Create Post</div>
            </div> */}

            {/* Add Community */}
            <div className={styles.iconWrapper}>
              <span onClick={() => setCommWindow((p) => !p)}>
                <AddCommunityIcon />
              </span>
              <div className={styles.tooltip}>Add Group</div>
            </div>

            {/* Notifications */}
            <div className={styles.iconWrapper}>
              <span onClick={() => navigate("/notification")}>
                <NotificationIcon />
              </span>
              <div className={styles.tooltip}>Notifications</div>
            </div>

            {/* Profile */}
            <div className={styles.profileWrapper}>
              <img
                src={user.avatar || "https://picsum.photos/40"}
                className={styles.avatar}
                alt="avatar"
              />

              <div className={styles.dropdown}>
                <div className={styles.userHeader}>
                  <img
                    src={user.avatar || "https://picsum.photos/40"}
                    className={styles.dropdownAvatar}
                    alt="avatar"
                  />
                  <div>
                    <div className={styles.username}>
                      u/{user.username}
                    </div>
                    <div className={styles.subText}>
                      View Profile
                    </div>
                  </div>
                </div>

                <div
                  className={styles.menuItem}
                  onClick={() => navigate("/profile")}
                >
                  View Profile
                </div>

                <div className={styles.menuItem}>
                  Edit Avatar
                </div>

                <div className={styles.menuItem}>
                  Drafts
                </div>

                <div className={styles.menuItem}>
                  Achievements
                </div>

                {/* Toggle */}
                <div className={styles.menuItem}>
                  <div className={styles.toggleRow}>
                    <span>Dark Mode</span>

                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={isDark}
                        onChange={toggleMode}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>

                <div
                  className={`${styles.menuItem} ${styles.logout}`}
                  onClick={logout}
                >
                  Log Out
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;