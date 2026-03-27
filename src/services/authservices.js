import api from "./api";

export async function login(id,pass){
    let resp = await api.post("auth/login",{
        username: id,
        password: pass
    },{
        headers: {
            "Content-Type": "application/json"
        }
    })
    return resp.data;
}