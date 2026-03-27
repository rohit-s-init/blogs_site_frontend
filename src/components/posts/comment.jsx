import { useState } from "react";
import styles from "./comment.module.css";
import { makeComment } from "../../services/postservices";
import { useAuth } from "../../context/UserContext";

export function formatTimeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);

    const diffInSeconds = Math.floor((now - past) / 1000);

    const minute = 60;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;

    if (diffInSeconds < minute) return `${diffInSeconds}s ago`;
    if (diffInSeconds < hour) return `${Math.floor(diffInSeconds / minute)}m ago`;
    if (diffInSeconds < day) return `${Math.floor(diffInSeconds / hour)}h ago`;
    if (diffInSeconds < month) return `${Math.floor(diffInSeconds / day)}d ago`;
    if (diffInSeconds < year) return `${Math.floor(diffInSeconds / month)}mo ago`;
    return `${Math.floor(diffInSeconds / year)}yr ago`;
}

const Comment = ({
    isLineVis = false,
    lineHeight = 0,
    comment,
    postId,
    refreshComments
}) => {

    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");

    async function submitReply() {

        if (!replyText.trim()) return;
        console.log("comment parent is ")
        console.log(comment)

        await makeComment(replyText, postId, comment.id);

        setReplyText("");
        setShowReplyBox(false);

        await refreshComments();
    }

    const {theme} = useAuth();

    return (
        <div className={styles.commentWrapper}>
            {isLineVis
                ? <div className={styles.threadLine}></div>
                : <div className={styles.threadLine} style={{ height: lineHeight }}></div>
            }

            <div className={styles.comment}>
                <div className={styles.avatar}>
                    <img src={comment.user_icon} alt="" />
                </div>

                <div className={styles.commentContent}>

                    <div className={styles.commentMeta}>
                        <strong>{comment.user_name}</strong>
                        <span> • {formatTimeAgo(comment.created_at)}</span>
                    </div>

                    <p style={theme == "dark" ? { color: "white" } : {}}>{comment.content}</p>

                    <div className={styles.commentActions}>
                        <span>⬆ {comment.likes_count}</span>

                        <span onClick={() => setShowReplyBox(!showReplyBox)}>
                            Reply
                        </span>

                        <span>Award</span>
                        <span>Share</span>
                    </div>

                    {showReplyBox && (
                        <div className={styles.replyBox}>
                            <textarea
                                placeholder="Write a reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />

                            <button onClick={submitReply}>
                                Reply
                            </button>
                        </div>
                    )}

                    {comment.replies &&
                        comment.replies.map((reply, ind) => (
                            <Comment
                                key={reply.id}
                                comment={reply}
                                postId={postId}
                                refreshComments={refreshComments}
                                lineHeight={reply?.replies ? "90px" : "0px"}
                                isLineVis={comment.replies.length === (ind + 1) ? false : true}
                            />
                        ))
                    }

                </div>
            </div>
        </div>
    );
};

export default Comment;