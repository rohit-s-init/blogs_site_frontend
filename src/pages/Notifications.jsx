import { useState } from "react";
import styles from "./Notifications.module.css";

function Notification() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "comment",
      user: "DeepCoder",
      message: "commented on your post.",
      time: "2h ago",
      read: false,
    },
    {
      id: 2,
      type: "upvote",
      user: "JSWarrior",
      message: "upvoted your comment.",
      time: "5h ago",
      read: true,
    },
    {
      id: 3,
      type: "follow",
      user: "ReactFan",
      message: "started following you.",
      time: "1d ago",
      read: false,
    },
    {
      id: 4,
      type: "mention",
      user: "StackMaster",
      message: "mentioned you in a comment.",
      time: "3d ago",
      read: true,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case "comment":
        return "💬";
      case "upvote":
        return "⬆️";
      case "follow":
        return "👤";
      case "mention":
        return "🔔";
      default:
        return "📌";
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Notifications</h2>
        </div>

        <div className={styles.list}>
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`${styles.notification} ${
                !n.read ? styles.unread : ""
              }`}
              onClick={() => markAsRead(n.id)}
            >
              <div className={styles.icon}>{getIcon(n.type)}</div>

              <div>
                <p className={styles.text}>
                  <strong>{n.user}</strong> {n.message}
                </p>
                <span className={styles.time}>{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notification;
