import { createContext, useContext, useEffect, useState } from 'react'

export const AuthContext = createContext(null);

function UserContext({ children }) {
    const [user, updateUser] = useState(null);
    const [theme, updateTheme] = useState("light");
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
        <AuthContext.Provider value={{ user, updateUser, theme, updateTheme }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => (useContext(AuthContext));
export default UserContext
