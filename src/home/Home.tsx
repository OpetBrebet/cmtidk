import { useState, useEffect } from "react"

import { useAuth } from "../hooks/useAuth"
import { useApi } from "../lib/api"

type DocumentSummary = {
    id: string
    title: string
    artist: string
}

export default function Home() {
    const [documents, setDocuments] = useState<DocumentSummary[]>([])
    const { isSignedIn } = useAuth()
    const { getDocuments, deleteDocument } = useApi()

    const fetchDocuments = async () => {
        const snapshot = await getDocuments()
        setDocuments(snapshot)
    }

    useEffect(() => {
        if (!isSignedIn) return

        fetchDocuments()
    }, [isSignedIn])

    const onDeleteRequest = (id: string) => {
        deleteDocument(id)
        fetchDocuments()
    }

    return (
        <>
            <div className="document-list-bar">
                <a href={`/editor/create`}>New Document</a>
            </div>
            <div className="documentList">
                <ul>
                    {documents.map(doc => (
                        <li key={doc.id} className="documentItem">
                            <a href={`/editor/${doc.id}`}>{doc.title} - {doc.artist}</a>
                            <button onClick={() => onDeleteRequest(doc.id)}>
                                Delete Document
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}
