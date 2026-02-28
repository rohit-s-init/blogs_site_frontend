import { useEffect, useState } from "react";
import styles from "./post.module.css";
import Posts from "../components/posts/posts";
import { useParams } from "react-router-dom";
import Comment from "../components/posts/comment";

function PostView() {

  const { postId } = useParams();
  const POST_ID = postId;

  let [post, updatePosts] = useState([{
    community: "r/webdev",
    author: "DeepCoder",
    time: "5 hours ago",
    title: "Understanding React Rendering in Depth",
    content:
      "React rendering can feel confusing at first. The key is understanding how state changes trigger re-renders and reconciliation.",
  }]);

  const [comments,setComments] = useState([
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
      const resp = await fetch("http://localhost:3000/api/posts/getpost/" + POST_ID,{
        method: "GET",
        credentials: "include"
      });
      const serverData = await resp.json();
      const postNeu = [
        {
          id: serverData.id,
          community: "h/" + serverData.group_name,
          communityAvatar: serverData.group_icon,
          time: serverData.created_at,
          title: serverData.title,
          content: serverData.content,
          upvotes: serverData.likes_count,
          comments: serverData.dislikes_count,
          ...serverData
        }
      ];
      updatePosts(postNeu);

    }
    async function operate2() {
      const resp = await fetch("http://localhost:3000/api/posts/comments/" + POST_ID);
      const serverData = await resp.json();
      console.log(serverData)
      setComments(serverData.comments);

    }
    operate();
    operate2();
  }, [])



  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Posts posts={post} type={"group"} />

        <div className={styles.commentsSection} style={{background: "transparent"}}>
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostView;
