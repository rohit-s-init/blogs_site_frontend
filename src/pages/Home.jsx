import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Posts from "../components/posts/posts";
import Sidebar from "../components/sidebar/sidebar";
import styles from "./Home.module.css";
import UsersList from "../components/users/users";
import GroupsList from "../components/groups/groups";
import { AuthContext } from "../context/UserContext";
import { getPosts, loadPosts, searchPosts } from "../services/postservices";
import { searchGroups } from "../services/groupservices";
import { searchUsers } from "../services/userservices";
import Loader from "../components/loader";
import { SearchFilter } from "../components/SearchFilter";



function Home({ search }) {
  const [posts, updatePosts] = useState(null);
  const [groups, updateGroups] = useState(null);
  const [users, updateUsers] = useState(null);
  const [activeScope, updateActiveScope] = useState("posts");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadPosts(updatePosts, 0, user);
  }, [user])

  useEffect(() => {
    if (activeScope == "posts") {
      searchPosts(updatePosts, search);
    }
    else if (activeScope == "groups") {
      searchGroups(updateGroups, search, user)
    }
    else if (activeScope == "users") {
      searchUsers(updateUsers, search);
    }

  }, [search, activeScope])

  return (
    <>



      <div className={styles.container} style={{ paddingTop: "90px" }} >
        <div>
          <SearchFilter active={activeScope} setActive={updateActiveScope} />
          {(activeScope == "posts" & posts != null) ? <Posts updatePosts={updatePosts} posts={posts} />:""}
          {(activeScope == "posts" & posts == null) ? <Loader/>:""}

          {(activeScope == "users" & users != null) ? <UsersList users={users} /> : ""}
          {(activeScope == "users" & users == null) ? <Loader /> : ""}

          {(activeScope == "groups" & groups != null) ? <GroupsList groups={groups} updateGroups={updateGroups} /> : ""}
          {(activeScope == "groups" & groups == null) ? <Loader /> : ""}

        </div>
        <Sidebar posts={posts} />
      </div>
    </>
  );
}

export default Home;
