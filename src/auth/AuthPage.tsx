export default function AuthPage() {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
            <h2>Sign in to continue</h2>
            <a href="/api/auth/google">
                <button>Sign in with Google</button>
            </a>
        </div>
    )
}
