import { useAuth } from "../../context/UserContext";
import styles from "./UsersList.module.css";
import { useState } from "react";

function UsersList({ users }) {

  const [shareUser, updateShareUser] = useState(null);

  const handleShare = (username) => {
    const profileUrl = window.location.origin + "/profile/" + username;
    // navigator.clipboard.writeText(profileUrl);
    // console.log("Profile link copied:", profileUrl);
    // alert(profileUrl);
    updateShareUser(profileUrl);
  };

  const { theme } = useAuth();

  return (
    <>

      <div className={styles.container}>
        {users.map((user) => (
          <div key={user.id} className={styles.card} style={theme == "dark" ? { background: "black", border: "0px solid white", borderBottom: "1px solid gray" } : {}}>

            {/* LEFT SIDE */}
            <div className={styles.left}>
              <img
                src={user.icon}
                alt={user.username}
                className={styles.avatar}
              />

              <div className={styles.info} style={theme == "dark" ? { color: "white" } : {}}>
                <div className={styles.username}>
                  u/{user.username}
                </div>

                <div className={styles.description} style={theme == "dark" ? { color: "#666" } : {}}>
                  {user.description}
                </div>

                <div className={styles.stats}>
                  <span>
                    <strong>{user.followers_count}</strong> Followers
                  </span>
                  <span>
                    <strong>{user.following_count}</strong> Following
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className={styles.actions}>
              <button
                className={styles.shareBtn}
                onClick={() => handleShare(user.id)}
              >
                Share
              </button>
            </div>

          </div>
        ))}
      </div>
      {shareUser && <div style={{ width: "100vw", height: "100vh", top: "0px", left: "0px", background: "rgb(0,0,0,0.6)", position: "fixed" }}>
        <div style={{
          width: "fit-content", height: "fit-content", margin: "auto", backgroundColor: "white",
          alignContent: "center",
          alignItems: "center",
          padding: "20px 50px",
          marginTop: "100px",
          color: "blue",
          borderRadius: "20px"
        }}>
          <div onClick={() => {
            updateShareUser(null);
          }} style={{ opacity: "1", float: "right", padding: "10px", right: "0px", top: "0px", position: "relative", transform: "translateY(-25px) translateX(40px)", cursor: "pointer" }}>X</div>
          {shareUser}
        </div>
      </div>}
    </>

  );
}

export default UsersList;