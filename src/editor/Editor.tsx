import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useDoc } from "./DocContext"
import { useAuth } from "../hooks/useAuth.ts"
import { useApi } from "../lib/api.ts"
import { createDocument } from "./factories.ts"
import Page from "./page/Page.tsx"
import Toolbar from "./toolbar/Toolbar.tsx"

import "./Editor.css"
import "./variables.css"
import { hydrateDocument } from "./utils.ts"

export default function Editor() {
    const { id } = useParams()
    const { user, isLoaded } = useAuth()
    const { getDocument, newDocument, updateDocument } = useApi()
    const { currentDoc, setCurrentDoc } = useDoc()

    const navigate = useNavigate()

    const isCreating = useRef(false)
    useEffect(() => {
        if (id) return
        if (isCreating.current) return

        isCreating.current = true
        const create = async () => {
            const res = await newDocument({
                ...createDocument(),
                title: "New Document",
                artist: "Me"
            })
            navigate(`/editor/${res.id}`, { replace: true })
        }
        create()
    }, [id])

    useEffect(() => {
        if (!id) return

        setCurrentDoc(prev => ({ ...prev, id: id }))
        const loadDocument = async () => {
            const snapshot = await getDocument(id);
            setCurrentDoc(hydrateDocument({ ...snapshot, id }))
        }

        loadDocument()
    }, [id, user])

    const documentRef = useRef(currentDoc)
    const [isDirty, setIsDirty] = useState(false)

    useEffect(() => {
        documentRef.current = currentDoc
        setIsDirty(true)
    }, [currentDoc])

    useEffect(() => {
        const interval = setInterval(() => {
            if (!id) return
            if (!isDirty) return
            if (!isLoaded) return
            if (documentRef.current.id !== id) return

            updateDocument(id, documentRef.current)
            setIsDirty(false)
        }, 5000)

        return () => clearInterval(interval)
    }, [isDirty, isLoaded, id])

    return (
        <div className="editor">
            <Toolbar />
            <div className="pages">
                <Page />
            </div>
        </div>
    )
}
