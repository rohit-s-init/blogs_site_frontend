import { useState, useEffect, useContext } from "react";
import styles from "./group.module.css";
import Posts from "../components/posts/posts.jsx"; // your existing feed component
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/UserContext.jsx";
import { getGroup, getGroupPosts } from "../services/groupservices.js";
import Loader from "../components/loader.jsx";

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
        createdAt: "Jan 2024",
        isDemo: true
    });
    const navigate = useNavigate();
    const { groupId } = useParams();



    const [description, setDescription] = useState("");
    const [rules, setRules] = useState([]);
    const { user, theme } = useContext(AuthContext);


    useEffect(() => {
        async function operate() {
            await getGroup(user, groupId, updateGroup);
            await getGroupPosts(groupId, 0, updatePosts);
            const fetchedDescription = group.description;
            setDescription(fetchedDescription);
            setJoined(group.is_member);
        }
        operate();
    }, [user]);

    useEffect(() => {
        if (!description) { console.log("returning from null desc"); return };

        const parts = group.description.split("---RULES---");

        if (parts.length > 1) {
            const rulesSection = parts[1].split("\n").map(rule => rule.trim()).filter(rule => rule.length > 0);
            setRules(rulesSection);
        }

    }, [description, user, group]);



    if (group.isDemo) {
        return <Loader />
    }


    return (
        <div className={styles.container}>

            {/* 🔥 TOP LANDSCAPE BACKGROUND */}
            <div
                className={styles.banner}
                style={{ backgroundImage: `url(${group.background})` }}
            />

            <div className={styles.layout} style={theme == "dark" ? { background: "black" } : {}}>

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
                            className={group.is_member ? styles.joinedBtn : styles.joinBtn}
                            onClick={() => setJoined(!joined)}
                        >
                            {group.is_member ? "Joined" : "Join"}
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
                                    className={group.is_member ? styles.joinedBtn : styles.joinBtn}
                                    onClick={() => setJoined(!joined)}
                                >
                                    {group.is_member ? "Joined" : "Join"}
                                </button>
                            </div>
                        </div>

                        <button
                            className={styles.createPostBtn}
                            onClick={() => navigate("/createpost/" + group.id)}
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
