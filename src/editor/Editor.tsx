import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useDoc } from "./DocContext"
import { useAuth } from "../hooks/useAuth.ts"
import { useApi } from "../lib/api.ts"
import { createDocument } from "./factories.ts"
import Page from "./page/Page.tsx"
import LineToolbar from "./page/LineToolbar.tsx"
import Toolbar from "./toolbar/Toolbar.tsx"

import "./Editor.css"
import "./variables.css"

export default function Editor() {
    const { id } = useParams()
    const { user } = useAuth()
    const { getDocument, newDocument, updateDocument } = useApi()
    const { currentDoc, setCurrentDoc } = useDoc()

    const navigate = useNavigate()

    useEffect(() => {
        if (id) return
        const create = async () => {
            const res = await newDocument(createDocument())
            navigate(`/editor/${res.id}`, { replace: true })
        }
        create()
    }, [id])

    useEffect(() => {
        if (!id) return

        setCurrentDoc(prev => ({ ...prev, id: id }))
        const loadDocument = async () => {
            const snapshot = await getDocument(id);
            setCurrentDoc(prev => ({ ...prev, ...snapshot, id }))
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
            if (!id) return
            if (!isDirty) return

            updateDocument(id, currentDoc)

            setIsDirty(false)
        }, 5000)

        return () => clearInterval(interval)
    }, [isDirty])

    return (
        <div className="editor">
            <Toolbar />
            <LineToolbar />
            <div className="pages">
                <Page />
            </div>
        </div>
    )
}
