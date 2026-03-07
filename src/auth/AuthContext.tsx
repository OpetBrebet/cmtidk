import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { auth } from "../lib/firebase.ts"
import { getRedirectResult, onAuthStateChanged, signOut, type User } from "firebase/auth"

type AuthContextType = {
    user: User | null
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    setUser(result.user)
                }
            })
            .catch((error) => {
                console.error("Login redirect error: ", error)
            })

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const logout = async () => {
        await signOut(auth)
    }

    if (loading) return null // or loading spinner

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used inside AuthProvider")
    return context
}
