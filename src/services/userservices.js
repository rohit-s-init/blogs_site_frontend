import api from "./api";

export const searchUsers = async (updateFunc, keyword) => {
    const response = await api.get(`/user/usersearch/${keyword}`);
    if (response.data.status) {
        updateFunc(response.data.users)
    }
};

export async function fetchProfile(USER_ID) {
    const response = await api.get(`user/profile/${USER_ID}`);
    const data = response.data;
    const profile = data.profile[0];
    console.log("profile");
    console.log(profile);
    const finalProfile =  {
        username: profile.username,
        avatar: profile.icon,
        bio: profile.description,
        followers: profile.followers_count,
        following: profile.following_count,
        activeFrom: new Date(profile.created_at).toLocaleDateString()
    };
    console.log(finalProfile);
    return finalProfile;
}

export async function fetchRecentComments(USER_ID) {
    const response = await api.get(`user/user_recent_comments/${USER_ID}/0`);
    const data = response.data;
    return data.comments.map(({ id, content, created_at, post_title, post_id }) => {
        return {
            id: id,
            postTitle: post_title,
            content: content,
            upvotes: 22,
            post_id
        }
    });
}

export async function fetchRecentPosts(USER_ID) {
    const response = await api.get(`user/user_recent_posts/${USER_ID}/0`);
    const data = response.data;
    return data.posts.map((serverData) => {
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
}