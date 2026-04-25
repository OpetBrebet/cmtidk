import { useState, useEffect } from "react"

type User = {
    id: string
    email: string
    name: string
    avatar: string | null
}

type AuthState = {
    user: User | null
    isLoaded: boolean
    isSignedIn: boolean
}

export function useAuth(): AuthState {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoaded: false,
        isSignedIn: false
    })

    useEffect(() => {
        fetch("/api/auth/me", { credentials: "include" })
            .then(r => r.json())
            .then(data => {
                setState({
                    user: data.user ?? null,
                    isLoaded: true,
                    isSignedIn: !!data.user
                })
            })
            .catch(() => {
                setState({ user: null, isLoaded: true, isSignedIn: false })
            })
    }, [])

    return state
}
