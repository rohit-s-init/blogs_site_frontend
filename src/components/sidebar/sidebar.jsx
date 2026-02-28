import styles from "./sidebar.module.css";

function RecentPosts({posts}) {


  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span>RECENT POSTS</span>
        <button>Clear</button>
      </div>

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

            <div className={styles.title}>
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
    </div>
  );
}

export default RecentPosts;
