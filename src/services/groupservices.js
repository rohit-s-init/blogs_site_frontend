import api from "./api";


export const searchGroups = async (updateFunc, keyword, auth = false) => {
    const endpoint = auth
        ? `/group/searchgroupsauth/${keyword}`
        : `/group/searchgroups/${keyword}`;

    const response = await api.get(endpoint);
    if (response.status) {
        updateFunc(response.data.groups);
    }
};


export async function getGroup(user, groupId, updateGroup) {
    const resp = await api.get(`/group/getgroup${user ? "auth" : ""}/` + groupId);
    const group = resp.data.group;
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
}


export async function getGroupPosts(groupId, offset, updatePosts) {
    const resp = await api.get(`group/posts/${groupId}/${offset}`);
    const posts = resp.data.posts;
    updatePosts(posts.map(val => {

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


export async function joinGroup(groupId){
    const resp = await api.post(`group/joingroup`,{
        groupId
    },{
        headers: {
            "Content-Type": "application/json"
        }
    })
    return resp.data;
}

export async function createGroup(payload){
    const resp = await api.post("group/creategroup",payload);
    return resp.data;
}