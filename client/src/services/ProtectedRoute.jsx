import { Navigate } from "react-router-dom"
import {useAuth} from '../hooks/useAuth'
// import {Navigate} from 'react-navigation/native'
export default function ProtectedRoute({children}) {
    const {user, loading} = useAuth();

    if (loading) return <div>Authenticating...</div>

    if(!user) {
        return <Navigate to="/" replace />
    }

    return children;
}

    // if(!user) {
    //     Alert.alert(
    //         'Authentication Failed',
    //         'Please log in and try again',
    //         [
    //             {
    //                 text: 'OK',
    //                 onPress: () => {<Navigate to="/" replace />}
    //             },
    //         ],
    //         {cancelable: false}
    //     )
    // }
    //Tryna use this if we can pretty please import some react-navigation