import { createContext, useContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    
    const fetchin = async () => {
            try {
                const res = await fetch('http://localhost:8080/auth/me', {
                    credentials: 'include',
                })

                const data = await res.json()
                if(res.ok) {
                    console.log('made it to res ok')
                    setUser(data.user)
                } else {
                    setUser(null)
                }

            }catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
    
    useEffect(() => {
        fetchin()
    }, [])

    const logoutFunc = async () => {
        await fetch('http://localhost:8080/auth/logout', {
            method: 'POST',
            credentials: 'include',
        })
        setUser(null)
    }

    return (
<<<<<<< HEAD
        <AuthContext.Provider value={{user, loading, refreshUser: fetchin, logoutFunc}}>
=======
        <AuthContext.Provider value={{user, loading, refreshUser: fetchin}}>
>>>>>>> 5bc54457a608f1a24d69ab6acef50b45aca18e2e
            {children}
        </AuthContext.Provider>
    )
}
