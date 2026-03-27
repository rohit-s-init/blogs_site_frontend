import { useEffect, useState, useContext } from "react";
import styles from "./post.module.css";
import Posts from "../components/posts/posts";
import { useParams } from "react-router-dom";
import Comment from "../components/posts/comment";
import { getComments, getPost, makeComment } from "../services/postservices";
import { AuthContext } from "../context/UserContext";
import Loader from "../components/loader";

function PostView() {

  const { postId } = useParams();
  const POST_ID = postId;

  let [post, updatePosts] = useState(null);

  const { user, theme } = useContext(AuthContext);

  const [comments, setComments] = useState([
    {
      "id": 1,
      "content": "Great explanation!",
      "parent_id": null,
      "created_at": "2026-02-20 09:26:43",
      "user_name": "alice",
      "user_id": 3,
      "user_icon": "https://cdn.pixabay.com/photo/2022/08/14/20/57/bee-7386616_640.png",
      "likes_count": 0,
      "dislikes_count": 0,
      "user_liked": 0,
      "user_disliked": 0,
      "replies": [
      ]
    }
  ])
  useEffect(() => {
    async function operate() {
      const postNeu = await getPost(POST_ID, user);
      updatePosts(postNeu);

    }
    async function operate2() {
      const serverData = await getComments(POST_ID);
      setComments(serverData.comments);

    }
    operate();
    operate2();

    console.log("final user posts is as follows");
    console.log(post);
  }, [user])

  useEffect(() => {
    console.log("updated post in operation 1 ")
    console.log(post)
  }, [post]);


  const [newComment, setNewComment] = useState("");
  async function refreshComments() {
    const serverData = await getComments(POST_ID);
    setComments(serverData.comments);

    setNewComment("");
  }
  async function handleSubmit() {
    console.log(newComment);
    if (!newComment.trim()) return;

    const payload = {
      content: newComment,
      postId: POST_ID,
      parentId: null
    };

    try {
      // call backend service
      // await addComment(payload);
      await makeComment(payload.content, payload.postId, payload.parentId);

      // reload comments
      refreshComments();
    } catch (err) {
      console.error(err);
    }
  }

  if(!post){
    return <Loader/>
  }

  return (
    <div className={styles.page} style={theme == "dark" ? { background: "black", paddingTop: "90px" } : { paddingTop: "90px" }}>
      <div className={styles.container}>
        <Posts updatePosts={updatePosts} posts={post} type={"group"} />
        <div className={styles.commentBox}>
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />

          <button onClick={handleSubmit}>Submit</button>
        </div>
        <div className={styles.commentsSection} style={{ background: "transparent" }}>
          {comments.map((comment) => (
            <Comment postId={POST_ID} key={comment.id} comment={comment} refreshComments={refreshComments} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostView;
