import { createContext, useContext, useEffect, useState } from 'react'
import { getMe } from '../services/authservices';

export const AuthContext = createContext(null);

function UserContext({ children }) {
    const [user, updateUser] = useState(null);
    const [theme, updateTheme] = useState("light");
    async function loadUser() {
        try {
            const data = await getMe();
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
