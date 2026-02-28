import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext(null);

function UserContext({ children }) {
    const [user, updateUser] = useState(null);
    async function loadUser() {
        try {
            const data = await fetch("http://localhost:3000/api/user/me", {
                method: "GET",
                credentials: "include"
            })
            const userData = await data.json();
            console.log(userData);
            updateUser(userData.user)
        } catch (error) {

        }
    }
    useEffect(() => {
        loadUser();
    }, [])
    return (
        <AuthContext.Provider value={{ user, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default UserContext
