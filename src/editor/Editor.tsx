import { useState, useEffect, useRef } from "react"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import type { User } from "firebase/auth"

import { db } from "../lib/firebase.ts"
import { useAuth } from "../auth/AuthContext.tsx"
import { documentToFirestore, firestoreToDocument } from "./converters.ts"
import Lines from "./Lines/Lines.tsx"
import Toolbar from "./Toolbar/Toolbar.tsx"
import "./Editor.css"

import type { Document as DocumentType, FirestoreDocument as FirestoreDocType } from "./types.ts"
import { useNavigate, useParams } from "react-router-dom"
import { DocProvider, useDoc } from "./DocContext"

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

        setCurrentDoc({ ...currentDoc, id: id })

        if (!user?.uid) return

        const loadDocument = async () => {
            const docRef = doc(db, "users", user.uid, "songs", id);
            const snapshot = await getDoc(docRef);

            if (!snapshot.exists()) return
            const newDocument = firestoreToDocument(snapshot.data())
            setCurrentDoc({ ...currentDoc, ...newDocument, id })
        }

        loadDocument()
    }, [id, user])

    const documentRef = useRef(currentDoc)
    const [isDirty, setIsDirty] = useState(false)

    useEffect(() => {
        documentRef.current = currentDoc

        if (
            currentDoc.lines.length === 1 &&
            currentDoc.lines[0].text === ""
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
                <div className="page" style={{
                    paddingTop: `${currentDoc.docSettings.margins.top}mm`,
                    paddingRight: `${currentDoc.docSettings.margins.right}mm`,
                    paddingBottom: `${currentDoc.docSettings.margins.bottom}mm`,
                    paddingLeft: `${currentDoc.docSettings.margins.left}mm`
                }}>
                    <Lines />
                </div>
            </div>
            <Toolbar />
        </div>
    )
}
