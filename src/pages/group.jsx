import { useState, useEffect, useContext } from "react";
import styles from "./group.module.css";
import Posts from "../components/posts/posts.jsx"; // your existing feed component
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/UserContext.jsx";

function Group() {
    const [joined, setJoined] = useState(false);
    const [posts, updatePosts] = useState([]);
    const [group, updateGroup] = useState({
        name: "javascript",
        icon: "https://picsum.photos/80?random=1",
        background: "https://picsum.photos/1200/300?random=5", // from DB
        description: "Discuss everything about JavaScript.",
        members: 12450,
        online: 321,
        createdAt: "Jan 2024"
    });

    const { groupId } = useParams();



    const [description, setDescription] = useState("");
    const [rules, setRules] = useState([]);
    const { user } = useContext(AuthContext);

    /* ================= LOAD DESCRIPTION ================= */

    useEffect(() => {
        async function operate() {
            // 🔥 Hardcoded for now (later fetch from API)
            console.log("user from group");
            console.log(user);

            const resp = await fetch(`http://localhost:3000/api/group/getgroup${user ? "auth" : ""}/` + groupId, { method: "GET",credentials: "include" });
            const data = await resp.json();
            console.log(data);
            const group = data.group;

            updateGroup(() => {
                return {
                    name: group.name,
                    icon: group.icon,
                    background: group.background, // from DB
                    description: group.description,
                    members: group.members_count,
                    online: 321,
                    createdAt: group.created_at,
                    ...group
                }
            })

            const fetchedDescription = data.group.description;


            setDescription(fetchedDescription);
            console.log(description);
            console.log(data);

            setJoined(group.is_member);

        }
        operate()
    }, [user]);


    useEffect(() => {
        async function operate() {

            const resp = await fetch(`http://localhost:3000/api/group/posts/${groupId}/0`, { method: "GET" });
            const data = await resp.json();
            updatePosts(data.posts.map(val => {

                let one = {
                    id: val.id,
                    community: "h/" + val.group_name,
                    communityAvatar: val.group_icon,
                    time: val.createdAt,
                    title: val.title,
                    content: val.content,
                    upvotes: val.likes_count,
                    comments: val.comment_count,
                    ...val
                }
                console.log(one);
                return one;
            }));
        }
        operate();
    }, [])



    /* ================= PARSE RULES ================= */

    useEffect(() => {
        if (!description) {console.log("returning from null desc");return};

        const parts = description.split("---RULES---");
        console.log("parts as follows");
        console.log(parts);

        if (parts.length > 1) {
            const rulesSection = parts[1]
                .trim()
                .split("\n")
                .map(rule => rule.trim())
                .filter(rule => rule.length > 0);

            setRules(rulesSection);
        }
    }, [description]);

    const navigate = useNavigate();


    return (
        <div className={styles.container}>

            {/* 🔥 TOP LANDSCAPE BACKGROUND */}
            <div
                className={styles.banner}
                style={{ backgroundImage: `url(${group.background})` }}
            />

            <div className={styles.layout}>

                {/* LEFT SECTION */}
                <div className={styles.main}>

                    {/* GROUP HEADER */}
                    <div className={styles.groupHeader}>
                        <img src={group.icon} className={styles.groupIcon} />

                        <div className={styles.groupInfo}>
                            <h2>{group.name}</h2>
                            <p>h/{group.name}</p>
                            <span>created by {group.creator_username}</span>

                            <div className={styles.stats}>
                                <strong>{group.members}</strong> Members •{" "}
                                created at
                                <strong> {group.created_at}</strong>
                            </div>
                        </div>

                        <button
                            className={joined ? styles.joinedBtn : styles.joinBtn}
                            onClick={() => setJoined(!joined)}
                        >
                            {joined ? "Joined" : "Join"}
                        </button>
                    </div>

                    <div className={styles.divider} />

                    {/* POSTS */}
                    <Posts posts={posts} type={"group"} />

                </div>

                {/* RIGHT SIDEBAR */}
                <div className={styles.sidebar}>

                    {/* ABOUT CARD */}
                    <div className={styles.sideCard}>
                        <h4>About h/{group.name}</h4>

                        <p className={styles.description}>
                            {group.description.split("---RULES---")[0]}
                        </p>

                        <div className={styles.sideStats}>
                            <div>
                                <strong>{group.members.toLocaleString()}</strong>
                                <span>Members</span>
                            </div>
                            <div>
                                <button
                                    className={joined ? styles.joinedBtn : styles.joinBtn}
                                    onClick={() => setJoined(!joined)}
                                >
                                    {joined ? "Joined" : "Join"}
                                </button>
                            </div>
                        </div>

                        <button
                            className={styles.createPostBtn}
                            onClick={() => navigate("/createpost/"+group.id)}
                        >
                            + Create Post
                        </button>
                    </div>

                    {/* RULES SECTION */}
                    <div className={styles.rulesCard}>
                        <h4>Community Rules</h4>

                        <div className={styles.rulesList}>
                            {rules.map((rule, index) => (
                                <div key={index} className={styles.ruleItem}>
                                    {index + 1}. {rule}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>


            </div>
        </div>
    );
}

export default Group;
