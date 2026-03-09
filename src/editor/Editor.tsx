import { useState, useEffect, useRef } from "react"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import type { User } from "firebase/auth"

import { db } from "../lib/firebase.ts"
import { useAuth } from "../auth/AuthContext.tsx"
import { documentToFirestore, firestoreToDocument } from "./converters.ts"
import Lines from "./Lines.tsx"
import Toolbar from "./Toolbar.tsx"
import "./Editor.css"

import type { Document as DocumentType, FirestoreDocument as FirestoreDocType } from "./types.ts"
import { useNavigate, useParams } from "react-router-dom"

async function saveDocument(document: DocumentType, user: (User | null)) {
    if (!user) return

    const firestoreDocument = documentToFirestore(document)

    await setDoc(
        doc(db, "users", user.uid, "songs", document.id),
        {
            ...firestoreDocument,
            updatedAt: serverTimestamp()
        }
    )
}

export default function Editor() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [document, setDocument] = useState<DocumentType>({
        id: id ?? "",
        createdAt: serverTimestamp(),

        title: "",
        artist: "",

        musicRoot: 0,
        lines: [{ id: crypto.randomUUID(), text: "", chords: [], isEditing: true }],
        draftChord: { id: "", index: 0, root: 0, type: "" }
    })

    const { user } = useAuth()

    useEffect(() => {
        if (!id) {
            const newId = crypto.randomUUID()
            navigate(`/editor/${newId}`, { replace: true })
            return
        }

        if (!user?.uid) return

        const loadDocument = async () => {
            const docRef = doc(db, "users", user.uid, "songs", id);
            const snapshot = await getDoc(docRef);

            if (!snapshot.exists()) return
            const newDocument = firestoreToDocument(snapshot.data() as FirestoreDocType)
            setDocument({ ...newDocument, id })
        }

        loadDocument()
    }, [id, user])

    const documentRef = useRef(document)
    const [isDirty, setIsDirty] = useState(false)

    useEffect(() => {
        documentRef.current = document

        if (
            document.lines.length === 1 &&
            document.lines[0].text === ""
        ) return
        setIsDirty(true)
    }, [document])

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isDirty) return

            saveDocument(documentRef.current, user)
            setIsDirty(false)
        }, 5000)

        return () => clearInterval(interval)
    }, [isDirty])

    return (
        <>
            <Lines
                document={document}
                setDocument={setDocument}
            />
            <Toolbar
                document={document}
                setDocument={setDocument}
            />
        </>
    )
}
