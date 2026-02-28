import styles from "./comment.module.css"

export function formatTimeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);

    const diffInSeconds = Math.floor((now - past) / 1000);

    const minute = 60;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;

    if (diffInSeconds < minute) {
        return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < hour) {
        return `${Math.floor(diffInSeconds / minute)}m ago`;
    } else if (diffInSeconds < day) {
        return `${Math.floor(diffInSeconds / hour)}h ago`;
    } else if (diffInSeconds < month) {
        return `${Math.floor(diffInSeconds / day)}d ago`;
    } else if (diffInSeconds < year) {
        return `${Math.floor(diffInSeconds / month)}mo ago`;
    } else {
        return `${Math.floor(diffInSeconds / year)}yr ago`;
    }
}
const Comment = ({ isLineVis = false, lineHeight = 0, comment }) => {
    return (
        <div className={styles.commentWrapper}>
            {isLineVis ? <div className={styles.threadLine}></div> : <div className={styles.threadLine} style={{ height: lineHeight }}></div>}

            <div className={styles.comment}>
                <div className={styles.avatar}>
                    <img src={comment.user_icon} alt="" srcset="" />
                </div>

                <div className={styles.commentContent}>
                    <div className={styles.commentMeta}>
                        <strong>{comment.user_name}</strong>
                        <span> • {formatTimeAgo(comment.created_at)}</span>
                    </div>

                    <p>{comment.content}</p>

                    <div className={styles.commentActions}>
                        <span>⬆ {comment.likes_count}</span>
                        <span>Reply</span>
                        <span>Award</span>
                        <span>Share</span>
                    </div>

                    {comment.replies &&
                        comment.replies.map((reply, ind) => (
                            <Comment lineHeight={reply?.replies ? "90px" : "0px"} isLineVis={comment.replies.length == (ind + 1) ? false : true} key={reply.id} comment={reply} />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Comment;