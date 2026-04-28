import { Link, Navigate, Routes, Route, Outlet } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import AuthPage from "./auth/AuthPage"
import Home from "./home/Home"
import Editor from "./editor/Editor"
import { DocProvider } from "./editor/DocContext.tsx"

import "./App.css"
import { ModalProvider } from "./context/ModalContext.tsx"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isSignedIn, isLoaded } = useAuth()
    if (!isLoaded) return null
    if (!isSignedIn) return <Navigate to="/login" />
    return <>{children}</>
}

function EditorLayout() {
    return (
        <ProtectedRoute>
            <DocProvider>
                <ModalProvider>
                    <Outlet />
                </ModalProvider>
            </DocProvider>
        </ProtectedRoute>
    )
}

function App() {
    return (
        <>
            <ul className="navbar">
                <li style={{ float: "left" }}><Link className="navbar-link" to="/">Home</Link></li>
                <li style={{ float: "left" }}><Link className="navbar-link" to="/editor">Editor</Link></li>
            </ul>
            <Routes>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/" element={
                    <ProtectedRoute>
                        <ModalProvider>
                            <Home />
                        </ModalProvider>
                    </ProtectedRoute>
                } />
                <Route element={<EditorLayout />}>
                    <Route path="/editor/create" element={<Editor />} />
                    <Route path="/editor/:id" element={<Editor />} />
                </Route>
            </Routes >
        </>
    )
}

export default App

