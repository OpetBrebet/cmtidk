import { useState, useEffect } from "react"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import type { User } from "firebase/auth"

import Lines from "./Lines.tsx"
import Toolbar from "./Toolbar.tsx"
import { db } from "../lib/firebase.ts"
import { useAuth } from "../auth/AuthContext.tsx"
import "./Editor.css"

import type { Document as DocumentType, FirestoreDocument as FirestoreDocType } from "./types.ts"
import { useNavigate, useParams } from "react-router-dom"

function toFirestore(doc: DocumentType): FirestoreDocType {
    return {
        id: doc.id,
        createdAt: doc.createdAt,
        title: doc.title,
        artist: doc.artist,
        musicRoot: doc.musicRoot,
        lines: doc.lines.map(line => ({
            id: line.id,
            text: line.text,
            chords: line.chords
        }))
    }
}

async function saveDocument(document: DocumentType, user: (User | null)) {
    if (!user) return

    await setDoc(
        doc(db, "users", user.uid, "songs", document.id),
        {
            ...toFirestore(document),
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
        lines: [{
            id: crypto.randomUUID(),
            text: "",
            chords: [],
            isEditing: true
        }],

        draftChord: {
            index: 0,
            root: 0,
            type: ""
        }
    })

    const { user } = useAuth()
    const [isDirty, setIsDirty] = useState(false)

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

            if (snapshot.exists()) setDocument(snapshot.data() as DocumentType)
        }

        loadDocument()
    }, [id, user])

    useEffect(() => {
        if (document.lines.length === 1 && document.lines[0].text === "") return
        setIsDirty(true)
    }, [document])

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isDirty) return

            saveDocument(document, user)
            setIsDirty(false)
        }, 10000)

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
