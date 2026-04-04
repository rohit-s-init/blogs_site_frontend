import api from "./api";


export const searchPosts = async (updatePosts, keyword, user) => {
    const response = await api.get(`/posts/postSearch/${keyword}`);
    console.log(response);
    const posts = response.data;
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
};


export async function getPosts(offSet) {
    const response = await api.get("posts/getposts/" + offSet);
    return response.data.map((serverData) =>
    ({
        id: serverData.id,
        community: "h/" + serverData.group_name,
        communityAvatar: serverData.group_icon,
        time: serverData.created_at,
        title: serverData.title,
        content: serverData.content,
        upvotes: serverData.user_liked,
        comments: serverData.comment_count,
        ...serverData
    })
    )
}


export async function loadPosts(updateFunc, offSet, user) {
    let response;
    if (!user) {
        response = await api.get("/posts/postsearch")
    } else {
        response = await api.get("/posts/postsearchauth")
    }
    const data = await response.data.map((serverData) =>
    ({
        id: serverData.id,
        community: "h/" + serverData.group_name,
        communityAvatar: serverData.group_icon,
        time: serverData.created_at,
        title: serverData.title,
        content: serverData.content,
        upvotes: serverData.user_liked,
        comments: serverData.comment_count,
        ...serverData
    })
    );
    updateFunc(data);
}


export async function getPost(POST_ID, user = null) {
    let response;
    console.log("user is as follows");
    console.log(user)
    if (user) {
        console.log("sending auth user request")
        response = await api.get("posts/getpostauth/" + POST_ID)
        const serverData = response.data;
        const postNeu = [
            {
                id: serverData.id,
                community: "h/" + serverData.group_name,
                communityAvatar: serverData.group_icon,
                time: serverData.created_at,
                title: serverData.title,
                content: serverData.content,
                upvotes: serverData.likes_count,
                comments: serverData.dislikes_count,
                ...serverData
            }
        ];

        console.log("final server data is as follows in user ")
        console.log(postNeu);
        return postNeu;
    } {
        response = await api.get("posts/getpost/" + POST_ID)
        const serverData = response.data;
        const postNeu = [
            {
                id: serverData.id,
                community: "h/" + serverData.group_name,
                communityAvatar: serverData.group_icon,
                time: serverData.created_at,
                title: serverData.title,
                content: serverData.content,
                upvotes: serverData.likes_count,
                comments: serverData.dislikes_count,
                ...serverData
            }
        ];

        console.log("final server data is as follows without user")
        console.log(postNeu);
        return postNeu;
    }

}


export async function getComments(POST_ID) {
    const response = await api.get("posts/comments/" + POST_ID);
    const serverData = response.data;
    return serverData;
}

export async function makeComment(content, postId, parentId) {
    const payload = { content, postId, parentId };
    console.log(payload);
    const response = await api.post("posts/createComment", payload, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return response;
}

export async function reactToPost(postId, type) {
    const payload = { type };
    const response = await api.post("posts/reacttopost/" + postId, payload, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return response;
}

export async function makePost(payload){
    const resp = await api.post("posts/createpost",payload);
    return resp.data;
}