import { Link, Routes, Route } from "react-router-dom"
import { signInWithPopup, signInWithRedirect, GoogleAuthProvider } from "firebase/auth"

import Editor from "./editor/Editor.tsx"
import { auth } from "./lib/firebase.ts"
import { useAuth } from "./auth/AuthContext.tsx"
import "./App.css"
import Home from "./home/Home.tsx"
import { DocProvider } from "./editor/DocContext.tsx"

async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider())
    return result.user
  } catch (error: any) {
    if (error.code === "auth/popup-blocked") {
      await signInWithRedirect(auth, new GoogleAuthProvider())
    } else {
      throw error
    }
  }
}

function App() {
  const { user, logout } = useAuth()

  return (
    <>
      <ul className="navbar">
        <li style={{ float: "left" }}><Link className="navbar-link" to="/">Home</Link></li>
        <li style={{ float: "left" }}><Link className="navbar-link" to="/editor">Editor</Link></li>
        <li style={{ float: "right" }}><button className="navbar-login" onClick={user ? logout : signInWithGoogle}>
          {user ? "Logout" : "Login"}
        </button></li>
      </ul>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={
          <DocProvider>
            <Editor />
          </DocProvider>
        } />
        <Route path="/editor/:id" element={
          <DocProvider>
            <Editor />
          </DocProvider>
        } />
      </Routes>
    </>
  )
}

export default App
