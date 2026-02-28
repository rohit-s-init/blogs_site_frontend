import {  useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Posts from "../components/posts/posts";
import Sidebar from "../components/sidebar/sidebar";
import styles from "./Home.module.css";
import UsersList from "../components/users/users";
import GroupsList from "../components/groups/groups";
import { AuthContext } from "../context/UserContext";



function SearchFilter({ onChange, active, setActive }) {

  const handleClick = (type) => {
    setActive(type);
    console.log("Selected:", type);
    // onChange && onChange(type);
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.btn} ${active === "posts" ? styles.active : ""}`}
        onClick={() => handleClick("posts")}
      >
        Posts
      </button>

      <button
        className={`${styles.btn} ${active === "users" ? styles.active : ""}`}
        onClick={() => handleClick("users")}
      >
        Users
      </button>

      <button
        className={`${styles.btn} ${active === "groups" ? styles.active : ""}`}
        onClick={() => handleClick("groups")}
      >
        Groups
      </button>
    </div>
  );
}

async function searchPosts(keyword, auth) {
  const resp = await fetch("http://localhost:3000/api/posts/postSearch/" + keyword);
  const data = resp.json();
  return data;
}
async function searchGroups(keyword, auth) {
  const resp = await fetch(`http://localhost:3000/api/group/searchgroups${auth?"auth":""}/` + keyword,{credentials: "include"});
  const data = resp.json();
  return data;
}
async function searchUsers(keyword, auth) {
  const resp = await fetch("http://localhost:3000/api/user/usersearch/" + keyword);
  const data = resp.json();
  return data;
}


function Home({ search }) {
  const [posts, updatePosts] = useState([]);
  const [groups, updateGroups] = useState([]);
  const [users, updateUsers] = useState([]);
  const [activeScope, updateActiveScope] = useState("posts");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function operate() {
      const resp = await fetch("https://hivemind-iota.vercel.app/api/posts/getposts/0", {
        method: "GET",
        credentials: "include"
      });
      const data = await resp.json();
      updatePosts(() => {
        return data.map((serverData) => {
          return {
            id: serverData.id,
            community: "h/" + serverData.group_name,
            communityAvatar: serverData.group_icon,
            time: serverData.created_at,
            title: serverData.title,
            content: serverData.content,
            upvotes: serverData.user_liked,
            comments: serverData.comment_count,
            ...serverData
          }
        })
      })
    }
    operate();
  }, [])

  useEffect(() => {
    if (activeScope == "posts") {
      searchPosts(search).then((posts) => {
        if (posts.status) {
          updatePosts(posts.posts.map((serverData) => {
            return {
              id: serverData.id,
              community: "h/" + serverData.group_name,
              communityAvatar: serverData.group_icon,
              time: serverData.created_at,
              title: serverData.title,
              content: serverData.content,
              upvotes: serverData.user_liked,
              comments: serverData.comment_count,
              ...serverData
            }
          }));
        }
      })
    }
    else if (activeScope == "groups") {
      searchGroups(search,user).then((data) => {
        updateGroups(data.groups)
      })
    }
    else if (activeScope == "users") {
      searchUsers(search).then((data) => {
        updateUsers(data.users)
      })
    }

  }, [search, activeScope])

  return (
    <>



      <div className={styles.container} >
        <div>
          <SearchFilter active={activeScope} setActive={updateActiveScope} />
          {activeScope == "posts" && <Posts posts={posts} />}
          {activeScope == "users" && <UsersList users={users} />}
          {activeScope == "groups" && <GroupsList groups={groups} updateGroups={updateGroups} />}
        </div>
        <Sidebar posts={posts} />
      </div>
    </>
  );
}

export default Home;
