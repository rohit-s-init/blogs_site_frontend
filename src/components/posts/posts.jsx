import { useEffect, useState } from "react";
import styles from "./posts.module.css";
import { useNavigate } from "react-router-dom";

/* ================= MEDIA CAROUSEL ================= */

function MediaCarousel({ media }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    function prev() {
        setCurrentIndex((prev) =>
            prev === 0 ? media.length - 1 : prev - 1
        );
    }

    function next() {
        setCurrentIndex((prev) =>
            prev === media.length - 1 ? 0 : prev + 1
        );
    }

    const current = media[currentIndex];

    return (
        <div className={styles.carousel}>
            <div className={styles.mediaWrapper}>
                {current.type === "image" ? (
                    <img
                        src={current.url}
                        alt="post media"
                        className={styles.media}
                    />
                ) : (
                    <video controls className={styles.media}>
                        <source src={current.url} type="video/mp4" />
                    </video>
                )}
            </div>

            {media.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className={`${styles.navBtn} ${styles.left}`}
                    >
                        ‹
                    </button>

                    <button
                        onClick={next}
                        className={`${styles.navBtn} ${styles.right}`}
                    >
                        ›
                    </button>

                    <div className={styles.indicator}>
                        {currentIndex + 1} / {media.length}
                    </div>
                </>
            )}
        </div>
    );
}

/* ================= POST COMPONENT ================= */
function SaveButton({ saved, onClick }) {
    return (
        <div className={styles.actionItem} onClick={onClick}>
            {saved ? (
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="18"
                    height="18"
                >
                    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                </svg>
            ) : (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    width="18"
                    height="18"
                >
                    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                </svg>
            )}
        </div>
    );
}

function Posts({ posts, type = "home" }) {


    function renderContent(rawContent) {


        if (!rawContent) return null;

        const imageMatches = [...rawContent.matchAll(/!\[image\]\((.*?)\)/g)];
        const videoMatches = [...rawContent.matchAll(/!\[video\]\((.*?)\)/g)];

        const cleanText = rawContent
            .replace(/!\[image\]\((.*?)\)/g, "")
            .replace(/!\[video\]\((.*?)\)/g, "")
            .trim();

        const media = [
            ...imageMatches.map(m => ({ type: "image", url: m[1] })),
            ...videoMatches.map(m => ({ type: "video", url: m[1] }))
        ];

        return (
            <>
                {cleanText && (
                    <p className={styles.preview}>{cleanText}</p>
                )}

                {media.length === 1 && (
                    media[0].type === "image" ? (
                        <img
                            src={media[0].url}
                            alt="post media"
                            className={styles.singleMedia}
                        />
                    ) : (
                        <video controls className={styles.singleMedia}>
                            <source src={media[0].url} type="video/mp4" />
                        </video>
                    )
                )}

                {media.length > 1 && (
                    <MediaCarousel media={media} />
                )}
            </>
        );
    }

    const navigate = useNavigate();
    const [savedPost, updateSavedPost] = useState(-1);
    useEffect(() => {
        const timeour = setTimeout(() => {
            updateSavedPost(-1);
        }, 1000)
        return () => {
            clearInterval(timeour);
        }
    }, [savedPost]);


    return (
        <div className={styles.feed}>
            {posts.map((post) => {
                // const [saved, handleSavedClick] = useState(false);
                // useEffect(() => {
                //     setTimeout(() => {
                //         handleSavedClick(false);
                //     }, 500);
                // }, [saved])

                return (
                    <>
                        <div key={post.id} className={styles.postCard}>
                            <div className={styles.contentSection}>

                                <div className={styles.metaRow}>
                                    <img
                                        src={post.communityAvatar}
                                        alt="community"
                                        className={styles.communityAvatar}
                                    />
                                    <span className={styles.communityName} style={{ cursor: "pointer" }} onClick={() => {
                                        if (type == "home") {
                                            navigate(`/group/${post.group_id}`, { replace: true })
                                        }
                                        else {
                                            navigate(`/profile/${post.user_id}`);
                                        }
                                    }}>

                                        {type == "group" ? ("u/" + post.username) : (post.community)}
                                    </span>
                                    <span className={styles.dot}>•</span>
                                    <span>{post.time}</span>
                                </div>

                                <h2 className={styles.title} onClick={() => {
                                    navigate("/post/" + post.id);
                                }}>
                                    {post.title}
                                </h2>

                                {renderContent(post.content)}

                                <div className={styles.actionBar}>
                                    <div className={styles.voteBox}>
                                        <button className={styles.voteBtn}>▲</button>
                                        <span>{post.upvotes}</span>
                                        <button className={styles.voteBtn}>▼</button>
                                    </div>

                                    <div className={styles.actionItem} onClick={()=>{
                                        navigate("/post/"+post.id)
                                    }}>
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            width="18"
                                            height="18"
                                        >
                                            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                                        </svg>
                                        <span>{post.comments}</span>
                                    </div>

                                    <SaveButton saved={post.id == savedPost} onClick={() => { updateSavedPost(post.id) }}></SaveButton>

                                    <div className={styles.actionItem}>
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            width="17"
                                            height="17"
                                        >
                                            <path d="M14 3h7v7" />
                                            <path d="M10 14L21 3" />
                                            <path d="M21 14v7h-7" />
                                            <path d="M3 10v11h11" />
                                        </svg>
                                        <span>Share</span>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </>
                )
            })}
        </div>
    );
}

export default Posts;
