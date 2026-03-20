import { useState } from "react"

import Line from "./Line.tsx"
import type { Document as DocumentType } from "../types"

import "./Lines.css"

type LinesFunction = {
    currentDoc: (DocumentType)
    setCurrentDoc: React.Dispatch<React.SetStateAction<DocumentType>>
}

export default function Lines({ currentDoc, setCurrentDoc }: LinesFunction) {
    const [editingId, setEditingId] = useState<string | null>(null)

    return (
        <div className="lines" style={{ fontSize: currentDoc.docSettings.fontSize }}>
            {currentDoc.lines.map(line => (
                <Line
                    key={line.id}
                    line={line}
                    currentDoc={currentDoc}
                    setCurrentDoc={setCurrentDoc}
                    editingId={editingId}
                    setEditingId={setEditingId}
                />
            ))}
        </div>
    )
}
