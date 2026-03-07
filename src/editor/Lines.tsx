import { useState } from "react"

import Line from "./Line.tsx"

import type {
    Document as DocumentType,
    Chord as ChordType
} from "./types"

type LinesFunction = {
    document: (DocumentType)
    setDocument: React.Dispatch<React.SetStateAction<DocumentType>>
}

export default function Lines({ document, setDocument }: LinesFunction) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    function updateLineText(lineId: string, newText: string) {
        setDocument(prev => ({
            ...prev,
            lines: prev.lines.map(line =>
                line.id === lineId
                    ? { ...line, text: newText }
                    : line
            )
        }))
    }

    function startEdit(id: string) {
        setDocument(prev => ({
            ...prev,
            lines: prev.lines.map(line =>
                line.id === id ? { ...line, isEditing: true } : line
            )
        }))
    }

    function stopEdit(id: string) {
        setDocument(prev => ({
            ...prev,
            lines: prev.lines.map(line =>
                line.id === id ? { ...line, isEditing: false } : line
            )
        }))
    }

    const addChord = (lineId: string, newChord: ChordType) => {
        setDocument(prev => ({
            ...prev,
            lines: prev.lines.map(line =>
                line.id === lineId
                    ? { ...line, chords: [...line.chords, newChord] }
                    : line
            )
        }))
    }

    const deleteChord = (lineId: string, chordId: string) => {
        setDocument(prev => ({
            ...prev,
            lines: prev.lines.map(line =>
                line.id === lineId
                    ? {
                        ...line,
                        chords: line.chords.filter(chord => chord.id !== chordId)
                    }
                    : line
            )
        }))
    }

    const handleCharClick = (
        lineId: string,
        charIndex: number
    ) => {
        if (document.draftChord === null) return

        const newChord = {
            ...document.draftChord,
            id: crypto.randomUUID(),
            index: charIndex
        }

        addChord(lineId, newChord)
    }

    return (
        <div className="lines">
            {document.lines.map((line, lineIndex) => (
                <div
                    key={line.id}
                    className={`
                            line-wrapper
                            ${hoveredIndex === lineIndex ? "hovered" : ""} 
                        `}
                    onMouseEnter={() => setHoveredIndex(lineIndex)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <Line
                        key={line.id}
                        line={line}
                        musicRoot={document.musicRoot}
                        onTextChange={updateLineText}
                        onStartEdit={startEdit}
                        onStopEdit={stopEdit}
                        onCharClick={(charIndex) =>
                            handleCharClick(line.id, charIndex)
                        }
                        onChordClick={(chordId) =>
                            deleteChord(line.id, chordId)
                        }
                    />
                </div>
            ))}
        </div>
    )
}
