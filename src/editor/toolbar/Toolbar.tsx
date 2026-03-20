import { createPortal } from "react-dom"
import {
    NOTES,
    numberToNote,
    noteToNumber
} from "../../lib/music.ts"

import { useState } from "react"
import ProjectSettings from "./ProjectSettings.tsx"
import { useDoc } from "../DocContext.tsx"

export default function Toolbar() {
    const { currentDoc, editorState, setEditorState } = useDoc()
    const [isPSOpen, setIsPSOpen] = useState(false) // PS is Project Settings

    const setChordRoot = (chordRoot: number) => {
        setEditorState(prev => ({
            ...prev,
            draftChord: {
                ...prev.draftChord,
                root: chordRoot
            }
        }))
    }

    const setChordType = (chordType: string) => {
        setEditorState(prev => ({
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
                    setIsPSOpen={setIsPSOpen}
                />, document.body
            )}

            <div className="toolbar-chords">
                <select name="chord-root" id="chord-root"
                    value={
                        numberToNote(editorState.draftChord.root + currentDoc.musicRoot)
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
                    value={editorState.draftChord.type}
                    onChange={(e) => {
                        setChordType(e.target.value)
                    }}
                    placeholder="Chord (e.g. Am, G7)"
                />
            </div>
        </div>
    )
}
