import { useState } from "react"

import Line from "./Line.tsx"

import type {
    Document as DocumentType,
    Chord as ChordType
} from "./types"

type LinesFunction = {
    currentDoc: (DocumentType)
    setCurrentDoc: React.Dispatch<React.SetStateAction<DocumentType>>
}

export default function Lines({ currentDoc, setCurrentDoc }: LinesFunction) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    function updateLineText(lineId: string, newText: string) {
        setCurrentDoc(prev => ({
            ...prev,
            lines: prev.lines.map(line =>
                line.id === lineId
                    ? { ...line, text: newText }
                    : line
            )
        }))
    }

    function startEdit(id: string) {
        setCurrentDoc(prev => ({
            ...prev,
            lines: prev.lines.map(line =>
                line.id === id ? { ...line, isEditing: true } : line
            )
        }))
    }

    function stopEdit(id: string) {
        setCurrentDoc(prev => ({
            ...prev,
            lines: prev.lines.map(line =>
                line.id === id ? { ...line, isEditing: false } : line
            )
        }))
    }

    const addChord = (lineId: string, newChord: ChordType) => {
        setCurrentDoc(prev => ({
            ...prev,
            lines: prev.lines.map(line =>
                line.id === lineId
                    ? { ...line, chords: [...line.chords, newChord] }
                    : line
            )
        }))
    }

    const deleteChord = (lineId: string, chordId: string) => {
        setCurrentDoc(prev => ({
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
        if (currentDoc.draftChord === null) return

        const newChord = {
            ...currentDoc.draftChord,
            id: crypto.randomUUID(),
            index: charIndex
        }

        addChord(lineId, newChord)
    }

    return (
        <div className="lines">
            {currentDoc.lines.map((line, lineIndex) => (
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
                        musicRoot={currentDoc.musicRoot}
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
