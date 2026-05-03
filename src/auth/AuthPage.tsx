import { useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"

export default function AuthPage() {
    const { isSignedIn } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isSignedIn) {
            navigate("/", { replace: true })
        }
    }, [isSignedIn])


    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
            <h2>Sign in to continue</h2>
            <a href="/api/auth/google">
                <button>Sign in with Google</button>
            </a>
        </div>
    )
}
