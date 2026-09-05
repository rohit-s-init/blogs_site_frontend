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
  const [offset, setOffset] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setOffset(0);
    setHasMorePosts(true);
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

  }, [search, activeScope, user])

  async function loadMorePosts() {
    if (loadingMore || !hasMorePosts) return;

    setLoadingMore(true);
    try {
      const nextOffset = offset + 1;
      const morePosts = await getPosts(nextOffset, user);

      if (morePosts.length === 0) {
        setHasMorePosts(false);
      } else {
        updatePosts(prev => [...(prev || []), ...morePosts]);
        setOffset(nextOffset);
      }
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    // Pagination only applies to the default feed, not search results
    if (activeScope !== "posts" || search) return;

    function handleScroll() {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 400;

      if (nearBottom) {
        loadMorePosts();
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeScope, search, offset, loadingMore, hasMorePosts, user])

  return (
    <>



      <div className={styles.container} style={{ paddingTop: "90px" }} >
        <div>
          <SearchFilter active={activeScope} setActive={updateActiveScope} />
          {(activeScope == "posts" & posts != null) ? <Posts updatePosts={updatePosts} posts={posts} /> : ""}
          {(activeScope == "posts" & posts == null) ? <Loader /> : ""}
          {(activeScope == "posts" && posts != null && loadingMore) ? <Loader /> : ""}

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
