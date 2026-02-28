import styles from "./UsersList.module.css";

function UsersList({ users }) {

  const handleShare = (username) => {
    const profileUrl = window.location.origin + "/profile/" + username;
    navigator.clipboard.writeText(profileUrl);
    console.log("Profile link copied:", profileUrl);
  };

  return (
    <div className={styles.container}>
      {users.map((user) => (
        <div key={user.id} className={styles.card}>

          {/* LEFT SIDE */}
          <div className={styles.left}>
            <img
              src={user.icon}
              alt={user.username}
              className={styles.avatar}
            />

            <div className={styles.info}>
              <div className={styles.username}>
                u/{user.username}
              </div>

              <div className={styles.description}>
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
              onClick={() => handleShare(user.username)}
            >
              Share
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}

export default UsersList;