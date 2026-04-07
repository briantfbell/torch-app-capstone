import { Navigate } from "react-router-dom"
import {useAuth} from '../hooks/useAuth'

export default function ProtectedRoute({children}) {
    const {user, loading} = useAuth();

    if (loading) return <div>Authenticating...</div>

    if(!user) {
        return <Navigate to="/" replace />
    }

    return children;
}