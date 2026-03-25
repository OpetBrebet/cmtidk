import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import type { User } from "firebase/auth"

import { useDoc } from "./DocContext"
import { useAuth } from "../auth/AuthContext.tsx"
import { db } from "../lib/firebase.ts"
import { documentToFirestore, firestoreToDocument } from "./converters.ts"
import Toolbar from "./toolbar/Toolbar.tsx"
import Page from "./page/Page.tsx"
import type { Document as DocumentType } from "./types.ts"

import "./Editor.css"

async function saveDocument(currentDoc: DocumentType, user: (User | null)) {
    if (!user) return

    const firestoreDocument = documentToFirestore(currentDoc)

    await setDoc(
        doc(db, "users", user.uid, "songs", currentDoc.id),
        {
            ...firestoreDocument,
            updatedAt: serverTimestamp()
        }
    )
}

export default function Editor() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { currentDoc, setCurrentDoc } = useDoc()

    const { user } = useAuth()

    useEffect(() => {
        if (!id) {
            const newId = crypto.randomUUID()
            navigate(`/editor/${newId}`, { replace: true })
            return
        }

        setCurrentDoc(prev => ({ ...prev, id: id }))

        if (!user?.uid) return

        const loadDocument = async () => {
            const docRef = doc(db, "users", user.uid, "songs", id);
            const snapshot = await getDoc(docRef);

            if (!snapshot.exists()) return
            const newDocument = firestoreToDocument(snapshot.data())
            setCurrentDoc(prev => ({ ...prev, ...newDocument, id }))
        }

        loadDocument()
    }, [id, user])

    const documentRef = useRef(currentDoc)
    const [isDirty, setIsDirty] = useState(false)

    useEffect(() => {
        documentRef.current = currentDoc

        if (
            currentDoc.sections[0]?.lineGroups[0]?.lines.length === 1 &&
            currentDoc.sections[0]?.lineGroups[0]?.lines[0]?.text === ""
        ) return
        setIsDirty(true)
    }, [currentDoc])

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isDirty) return

            saveDocument(documentRef.current, user)
            setIsDirty(false)
        }, 5000)

        return () => clearInterval(interval)
    }, [isDirty])

    return (
        <div className="editor">
            <div className="pages">
                <Page />
            </div>
            <Toolbar />
        </div>
    )
}
