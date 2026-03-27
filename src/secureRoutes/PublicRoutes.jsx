import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/UserContext.jsx';

function PublicRoutes({ children }) {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    return (
        <div>
            {children}
        </div>
    )
}

export default PublicRoutes
