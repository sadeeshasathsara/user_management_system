import React from 'react';
import { checkAuth } from '../apis/checkauth.api';
import { Navigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

function ProtectRoutes({ children }) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            try {
                const res = await checkAuth();
                setIsAuthenticated(res === true);
            } catch (error) {
                console.error('Error checking authentication:', error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading) return <LoadingScreen isLoading={true} />;

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectRoutes;
