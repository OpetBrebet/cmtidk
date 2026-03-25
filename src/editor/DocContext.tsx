import { createContext, useContext, useState } from "react";

import { createDocument, createEditorState } from "./factories";
import type { Document as DocumentType, EditorState as EditorStateType } from "./types"

type DocContextType = {
    currentDoc: DocumentType
    setCurrentDoc: React.Dispatch<React.SetStateAction<DocumentType>>
    editorState: EditorStateType
    setEditorState: React.Dispatch<React.SetStateAction<EditorStateType>>
}

const DocContext = createContext<DocContextType | null>(null)

export const useDoc = () => {
    const ctx = useContext(DocContext)
    if (!ctx) throw new Error("useDoc must be used within DocProvider")
    return ctx
}

export const DocProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentDoc, setCurrentDoc] = useState<DocumentType>(createDocument())
    const [editorState, setEditorState] = useState<EditorStateType>(createEditorState())

    return (
        <DocContext.Provider value={{ currentDoc, setCurrentDoc, editorState, setEditorState }}>
            {children}
        </DocContext.Provider>
    )
}
