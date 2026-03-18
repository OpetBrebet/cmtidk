import { createPortal } from "react-dom"
import {
    NOTES,
    numberToNote,
    noteToNumber
} from "../../lib/music.ts"

import type { Document as DocumentType } from "../types.ts"
import { useState } from "react"
import ProjectSettings from "./ProjectSettings.tsx"

type ToolbarFunction = {
    currentDoc: (DocumentType)
    setCurrentDoc: React.Dispatch<React.SetStateAction<DocumentType>>
}

export default function Toolbar({
    currentDoc,
    setCurrentDoc
}: ToolbarFunction) {
    const [isPSOpen, setIsPSOpen] = useState(false) // PS is Project Settings

    const setChordRoot = (chordRoot: number) => {
        setCurrentDoc(prev => ({
            ...prev,
            draftChord: {
                ...prev.draftChord,
                root: chordRoot
            }
        }))
    }

    const setChordType = (chordType: string) => {
        setCurrentDoc(prev => ({
            ...prev,
            draftChord: {
                ...prev.draftChord,
                type: chordType
            }
        }))
    }

    return (
        <div className="toolbar">
            <button onClick={() => setIsPSOpen(true)}>
                Project Settings
            </button>

            {isPSOpen && createPortal(
                <ProjectSettings
                    currentDoc={currentDoc}
                    setCurrentDoc={setCurrentDoc}
                    setIsPSOpen={setIsPSOpen}
                />, document.body
            )}

            <div className="toolbar-chords">
                <select name="chord-root" id="chord-root"
                    value={
                        numberToNote(currentDoc.draftChord.root + currentDoc.musicRoot)
                    }
                    onChange={(e) => {
                        const value = noteToNumber(e.target.value)
                        setChordRoot(value - currentDoc.musicRoot)
                    }}
                >
                    {NOTES.map(note => (
                        <option key={note} value={note}>
                            {note}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={currentDoc.draftChord.type}
                    onChange={(e) => {
                        setChordType(e.target.value)
                    }}
                    placeholder="Chord (e.g. Am, G7)"
                />
            </div>
        </div>
    )
}
