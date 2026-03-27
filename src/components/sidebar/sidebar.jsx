import { useAuth } from "../../context/UserContext";
import Loader from "../loader";
import styles from "./sidebar.module.css";

function RecentPosts({ posts }) {
  console.log("initial posts")
  console.log(posts);

  const { theme } = useAuth();

  function renderPosts() {
    return (<>
      {posts.map((post) => (
        <div key={post.id} className={styles.item}>

          <div className={styles.left}>
            <img
              src={post.communityAvatar}
              alt="community"
              className={styles.avatar}
            />
          </div>

          <div className={styles.content}>
            <div className={styles.meta}>
              {post.community} • {post.time}
            </div>

            <div className={styles.title} style={theme == "dark" ? { color: "white" } : {}}>
              {post.title}
            </div>

            <div className={styles.stats}>
              {post.upvotes} upvotes • {post.comments} comments
            </div>
          </div>

          {post.thumbnail && (
            <img
              src={post.thumbnail}
              alt="thumb"
              className={styles.thumbnail}
            />
          )}
        </div>
      ))}
    </>)
  }

  return (
    <div className={styles.card} style={theme == "dark" ? { backgroundColor: "#181a1c" } : {}}>
      <div className={styles.header} style={theme == "dark" ? { backgroundColor: "#181a1c", color: "white" } : {}}>
        <span>RECENT POSTS</span>
        <button>Clear</button>
      </div>

      {posts == null ? <Loader /> : renderPosts()}


    </div>
  );
}

export default RecentPosts;
