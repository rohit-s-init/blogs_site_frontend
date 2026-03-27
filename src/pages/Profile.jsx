import { useState, useEffect } from "react";
import styles from "./profile.module.css";
import PostMain from "../components/posts/posts.jsx"
import { useParams } from "react-router-dom";
import * as userServices from "../services/userservices.js"
import Loader from "../components/loader.jsx";
import { useAuth } from "../context/UserContext.jsx";

function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const { userId } = useParams();


  // for testing 
  const USER_ID = userId;

  const [user, setUser] = useState(null);
  const [posts, updateRecentPosts] = useState([]);
  const [comments, updateComments] = useState([]);




  async function fetchProfile() {
    try {
      const profile = await userServices.fetchProfile(USER_ID)

      setUser(profile);

    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  }
  async function fetchRecentComments() {
    const comments = await userServices.fetchRecentComments(USER_ID);
    updateComments(comments);
  }
  async function fetchRecentPosts() {
    const recentPosts = await userServices.fetchRecentPosts(USER_ID);
    updateRecentPosts(recentPosts);
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab == "posts") {
      fetchRecentPosts();
    }
    else if (activeTab == "comments") {
      fetchRecentComments();
      console.log(comments)
    }
  }, [activeTab])




  const saved = [
    {
      id: 1,
      title: "Understanding React Context deeply",
      community: "r/reactjs",
    },
  ];

  const tabComponents = {
    // posts: <Posts posts={posts} />,
    posts: <PostMain posts={posts} />,
    comments: <Comments comments={comments} />,
    upvoted: <Upvoted posts={posts} />,
    downvoted: <Downvoted />,
  };

  const { theme } = useAuth();

  if (!user) {
    return <Loader />
  }

  return (
    <>
      <div className={styles.profileContainer} style={theme == "dark" ? { paddingTop: "90px", color: "#999" } : { paddingTop: "90px" }}>

        <div className={styles.activeFrom}>
          Active from {user.activeFrom}
        </div>

        <div className={styles.profileHeader}>
          <img
            src={user.avatar}
            alt="avatar"
            className={styles.profileAvatar}
          />

          <div className={styles.profileInfo}>
            <h2 style={theme == "dark" ? { color: "#e1e0e8" } : {}}>{user.username}</h2>
            <p className={styles.username}>u/{user.username}</p>
            <p className={styles.bio}>{user.bio}</p>

            <div className={styles.followStats}>
              <span><strong>{user.followers}</strong> Followers</span>
              <span><strong>{user.following}</strong> Following</span>
            </div>

            <button
              className={
                isFollowing ? styles.unfollowBtn : styles.followBtn
              }
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>

        <div className={styles.profileTabs}>
          {[
            "posts",
            "comments",
            "upvoted",
            "downvoted",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ""
                }`}
              style={theme == "dark" ? { color: "#999" } : {}}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className={styles.profileContent}>
          {tabComponents[activeTab]}
        </div>
      </div>
    </>
  );
}

export default Profile;

/* ================= COMPONENTS ================= */

function Overview({ posts, comments }) {
  return (
    <div>
      <h3>Recent Posts</h3>
      {posts.slice(0, 1).map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      <h3 style={{ marginTop: "30px" }}>Recent Comments</h3>
      {comments.slice(0, 1).map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

function Posts({ posts }) {
  return posts.map((post) => (
    <PostCard key={post.id} post={post} />
  ));
}

function Comments({ comments }) {
  return comments.map((comment) => (
    <CommentCard key={comment.id} comment={comment} />
  ));
}

function Saved({ saved }) {
  return saved.map((item) => (
    <div key={item.id} className={styles.simpleCard}>
      <strong>{item.title}</strong>
      <p>{item.community}</p>
    </div>
  ));
}

function History() {
  return <div>No browsing history yet 👀</div>;
}

function Upvoted({ posts }) {
  return posts.map((post) => (
    <PostCard key={post.id} post={post} />
  ));
}

function Downvoted() {
  return <div>You haven't downvoted anything yet 👍</div>;
}

function PostCard({ post }) {
  return (
    <div className={styles.card}>
      <p className={styles.community}>{post.community}</p>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div className={styles.meta}>
        <span>⬆ {post.upvotes}</span>
        <span>💬 {post.comments}</span>
      </div>
    </div>
  );
}

function CommentCard({ comment }) {
  return (
    <div className={styles.card}>
      <p className={styles.community}>
        Commented on: {comment.postTitle}
      </p>
      <p>{comment.content}</p>
      <div className={styles.meta}>
        <span>⬆ {comment.upvotes}</span>
      </div>
    </div>
  );
}
