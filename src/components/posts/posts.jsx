import { useEffect, useState } from "react";
import styles from "./posts.module.css";
import { useNavigate } from "react-router-dom";
import { reactToPost } from "../../services/postservices";
import Loader from "../loader";
import { SaveButton } from "../../icons/SaveButton";
import { useAuth } from "../../context/UserContext";

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

function renderContent(rawContent) {


    if (!rawContent) return null;

    const imageMatches = [...rawContent.matchAll(/!\[image\]\((.*?)\)/g)];
    const videoMatches = [...rawContent.matchAll(/!\[video\]\((.*?)\)/g)];

    console.log("image matches video nathces");
    console.log(imageMatches);
    console.log(videoMatches);

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

function Posts({ updatePosts, posts, type = "home" }) {




    const navigate = useNavigate();
    const { theme } = useAuth();
    const [savedPost, updateSavedPost] = useState(-1);
    useEffect(() => {
        const timeour = setTimeout(() => {
            updateSavedPost(-1);
        }, 1000)
        return () => {
            clearInterval(timeour);
        }
    }, [savedPost]);


    if (posts.length == 0) return (<Loader></Loader>);


    return (
        <div className={styles.feed}>
            {posts.map((post, ind) => {
                // const [saved, handleSavedClick] = useState(false);
                // useEffect(() => {
                //     setTimeout(() => {
                //         handleSavedClick(false);
                //     }, 500);
                // }, [saved])

                return (
                    <>
                        <div key={post.id} className={styles.postCard} style={theme == "dark" ? { background: "black" } : {}}>
                            <div className={styles.contentSection}>

                                <div className={styles.metaRow}>
                                    <img
                                        src={post.communityAvatar}
                                        alt="community"
                                        className={styles.communityAvatar}
                                    />
                                    <span className={styles.communityName} style={theme == "dark" ? { color: "#6b7280", cursor: "pointer" } : { cursor: "pointer" }} onClick={() => {
                                        if (type == "home") {
                                            navigate(`/group/${post.group_id}`, { replace: true })
                                        }
                                        else {
                                            navigate(`/profile/${post.user_id}`);
                                        }
                                    }}>

                                        {type == "group" ? ("u/" + post.username) : (post.community)}
                                    </span>
                                    <span className={styles.dot} style={theme == "dark" ? { color: "white" } : {}}>•</span>
                                    <span>{post.time}</span>
                                </div>

                                <h2 className={styles.title} onClick={() => {
                                    navigate("/post/" + post.id);
                                }} style={theme == "dark" ? { color: "white" } : {}}>
                                    {post.title}
                                </h2>

                                {renderContent(post.content)}

                                <div className={styles.actionBar}>
                                    <div className={styles.voteBox} style={theme == "dark" ? {background: "#48484b", color: "#c9c4c4"} : {}}>
                                        <button style={{ color: post.user_liked ? 'red' : '' }} className={styles.voteBtn} onClick={async () => {
                                            updatePosts(prev => {
                                                let neu = [...prev];
                                                if (neu[ind].user_liked) return prev;
                                                neu[ind].likes_count++;
                                                neu[ind].user_liked = true;
                                                neu[ind].user_disliked = false;
                                                return neu;
                                            })
                                            await reactToPost(post.id, "like");
                                        }}>▲</button>
                                        {/* <span>{post.upvotes}</span> */}
                                        <span>{post.likes_count}</span>
                                        {/* {JSON.stringify(post)+"post is "} */}
                                        <button style={{ color: post.user_disliked ? 'red' : '' }} className={styles.voteBtn} onClick={async () => {
                                            updatePosts(prev => {
                                                let neu = [...prev];
                                                if (neu[ind].user_disliked) return prev;
                                                neu[ind].likes_count--;
                                                neu[ind].user_liked = false;
                                                neu[ind].user_disliked = true;
                                                return neu;
                                            })
                                            await reactToPost(post.id, "dislike");
                                            console.log(posts);
                                        }}>▼</button>
                                    </div>

                                    <div className={styles.actionItem} style={theme == "dark" ? {background: "#48484b",color: "#c9c4c4"} : {}} onClick={() => {
                                        navigate("/post/" + post.id)
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
                                        <span>{post.comment_count}</span>
                                    </div>

                                    <SaveButton saved={post.id == savedPost} onClick={() => { updateSavedPost(post.id) }}></SaveButton>

                                    <div className={styles.actionItem} style={theme == "dark" ? {background: "#48484b",color: "#c9c4c4"} : {}}>
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
                        </div >
                    </>
                )
            })}
        </div >
    );
}

export default Posts;
