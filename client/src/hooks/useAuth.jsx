import { useEffect, useState } from "react";

export function useAuth() {
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

    return {user, loading}
}