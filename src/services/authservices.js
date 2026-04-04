import api from "./api";

export async function login(id, pass) {
    let resp = await api.post("auth/login", {
        username: id,
        password: pass
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return resp.data;
}

export async function logout() {
    let resp = await api.post("auth/logout")
}

export async function getMe() {
    let resp = await api.post("user/me");
    return resp.data;
}


export async function registerUser(payload) {
    let resp = await api.post("auth/register", payload, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return resp.data;
}

export async function resendOtp(email) {
    let resp = await api.post("auth/resend-otp", {
        email
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return resp.data;
}

export async function verifyUser(payload){
    let resp = await api.post("auth/verify-otp",payload,{
        headers: {
            "Content-Type": "application/json"
        }
    });
    return resp.data;
}