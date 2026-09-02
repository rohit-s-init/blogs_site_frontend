import { createContext, useContext, useEffect, useState } from 'react'
import { getMe } from '../services/authservices';

export const AuthContext = createContext(null);

function UserContext({ children }) {
    const [user, updateUser] = useState(null);
    const [theme, updateTheme] = useState("light");
    const [loading, setLoading] = useState(true);
    async function loadUser() {
        try {
            const userData = await getMe();
            console.log(userData);
            updateUser(userData.user)
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadUser();
    }, [])
    return (
        <AuthContext.Provider value={{ user, updateUser, theme, updateTheme, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => (useContext(AuthContext));
export default UserContext
