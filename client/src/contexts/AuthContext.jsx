import { createContext, useContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchin = async () => {
            try {
                const res = await fetch('http://localhost:8080/auth/me', {
                    credentials: 'include',
                })

                const data = await res.json()
                if(res.ok) {
                    console.log('made it to res ok')
                    setUser(data.message)
                } else {
                    setUser(null)
                }

            }catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        fetchin()
    }, [])

    return (
        <AuthContext.Provider value={{user, loading}}>
            {children}
        </AuthContext.Provider>
    )
}