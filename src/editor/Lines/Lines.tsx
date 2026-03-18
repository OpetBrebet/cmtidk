import { useState } from "react"

import Line from "./Line.tsx"
import type { Document as DocumentType } from "../types"

import "./Lines.css"

type LinesFunction = {
    currentDoc: (DocumentType)
    setCurrentDoc: React.Dispatch<React.SetStateAction<DocumentType>>
}

export default function Lines({ currentDoc, setCurrentDoc }: LinesFunction) {
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)

    return (
        <div className="lines">
            {currentDoc.lines.map(line => (
                <div
                    key={line.id}
                    className={`
                            line-wrapper
                            ${hoveredId === line.id ? "hovered" : ""} 
                        `}
                    onMouseEnter={() => setHoveredId(line.id)}
                    onMouseLeave={() => setHoveredId(null)}
                >
                    <Line
                        key={line.id}
                        line={line}
                        currentDoc={currentDoc}
                        setCurrentDoc={setCurrentDoc}
                        isHovered={line.id === hoveredId}
                        editingId={editingId}
                        setEditingId={setEditingId}
                    />
                </div>
            ))}
        </div>
    )
}
