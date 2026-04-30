import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useApi } from "../lib/api"

import "./Home.css"
import { Add, Assignment, DeleteForever } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

type DocumentSummary = {
    id: string
    title: string
    artist: string
}

export default function Home() {
    const [documents, setDocuments] = useState<DocumentSummary[]>([])
    const navigate = useNavigate()
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
        <div className="document-list-body">
            <div className="list-top-bar">
                <button
                    className="document-create"
                    onClick={() => navigate('/editor/create')}
                >
                    New Document
                    <Add />
                </button>
            </div>
            <ul className="document-list">
                <li className="document-list-title">
                    <span className="document-list-title-name">Name</span>
                </li>
                {documents.map(doc => (
                    <li
                        key={doc.id}
                        className="document-item"
                        onClick={() => navigate(`/editor/${doc.id}`)}
                    >
                        <Assignment />
                        <div className="document-item-name">
                            <span className="document-item-title">{doc.title}</span>
                            <span className="document-item-artist">{doc.artist}</span>
                        </div>
                        <button className="document-delete-button" onClick={() => onDeleteRequest(doc.id)}>
                            <DeleteForever />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
