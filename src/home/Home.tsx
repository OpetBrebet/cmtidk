import { useState, useEffect } from "react"
import { collection, query, orderBy, getDocs } from "firebase/firestore"
import type { User } from "firebase/auth"

import { db } from "../lib/firebase.ts"
import { useAuth } from "../auth/AuthContext.tsx"

import { useNavigate } from "react-router-dom"

type DocumentSummary = {
    id: string
    title: string
    artist: string
}

export default function Home() {
    const navigate = useNavigate()

    const { user } = useAuth()

    const [documents, setDocuments] = useState<DocumentSummary[]>([])

    useEffect(() => {
        if (!user) return

        const fetchDocuments = async () => {
            const q = query(
                collection(db, "users", user.uid, "songs"),
                orderBy("updatedAt", "desc")
            )

            const snapshot = await getDocs(q)

            const docs: DocumentSummary[] = snapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title ?? "Untitled",
                artist: doc.data().artist ?? ""
            }))

            setDocuments(docs)
        }

        fetchDocuments()
    }, [user])

    return (
        <div className="documentList">
            <ul>
                {documents.map(doc => (
                    <li key={doc.id}>
                        <a href={`#/editor/${doc.id}`}>{doc.title} - {doc.artist}</a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
