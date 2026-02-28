import { useNavigate } from "react-router-dom";
import styles from "./GroupsList.module.css";

function GroupsList({ groups, updateGroups }) {
  const navigate = useNavigate();

  const handleShare = (groupName) => {
    const url = window.location.origin + "/group/" + groupName;
    navigator.clipboard.writeText(url);
    console.log("Group link copied:", url);
  };

  const handleJoin = async (id) => {
    // alert(id);
    try {
      const response = await fetch(
        "http://localhost:3000/api/group/joingroup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ groupId: id }),
        }
      );

      const data = await response.json();

      updateGroups(prev => {
        return prev.map(val => {
          if (val.id == id) {
            const d = val;
            d.is_member = 1;
            d.members_count++;
            return d;
          }
          else return val;
        })
      })
      console.log(groups);

    } catch (error) {
      console.error("Join error:", error.message);
      alert(error.message);
    }
  };


  return (
    <div className={styles.container}>
      {groups.map((group) => (
        <div key={group.id} className={styles.card} onClick={() => {
          navigate(`/group/${group.id}`, { replace: true })
        }}>

          {/* Background Banner */}
          <div
            className={styles.banner}
            style={{ backgroundImage: `url(${group.background})` }}
          />

          <div className={styles.content}>

            {/* Top Section */}
            <div className={styles.topRow}>
              <img
                src={group.icon}
                alt={group.name}
                className={styles.icon}
              />

              <div className={styles.info}>
                <div className={styles.name}>
                  h/{group.name}
                </div>

                <div className={styles.description}>
                  {group.description.split("---RULES---")[0]}
                </div>

                <div className={styles.meta}>
                  Created by <strong>u/{group.creator_username}</strong>
                </div>

                <div className={styles.members}>
                  <strong>{group.members_count}</strong> Members
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
              <button
                className={group.is_member ? styles.joinBtn : styles.joinedBtn}
                onClick={(e) => {
                  e.preventDefault();
                  if (!group.is_member) { handleJoin(group.id) }
                }}
              >
                {group.is_member ? "Joined" : "Join"}
              </button>

              <button
                className={styles.shareBtn}
                onClick={(e) => handleShare(group.id)}
              >
                Share
              </button>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

export default GroupsList;