import { createPortal } from "react-dom"
import { useState } from "react"

import {
    NOTES,
    numberToNote,
    noteToNumber
} from "../../lib/music.ts"
import ProjectSettings from "./ProjectSettings.tsx"
import { useDoc } from "../DocContext.tsx"

import "./Toolbar.css"
import { FormatAlignJustify, Settings, VerticalSplit } from "@mui/icons-material"

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

    const setEditingMode = (editingMode: string) => {
        setEditorState(prev => ({
            ...prev,
            editingMode: editingMode
        }))
    }

    return (
        <div className="toolbar">
            <div className="toolbar-project-settings">
                <button className="toolbar-settings-button" onClick={() => setIsPSOpen(true)}>
                    <div>
                        <Settings />
                    </div>
                    Project Settings
                </button>

                {isPSOpen && createPortal(
                    <ProjectSettings
                        setIsPSOpen={setIsPSOpen}
                    />, document.body
                )}
            </div>

            <hr className="toolbar-divider" />

            <div className="toolbar-chords">
                <select
                    name="chord-root"
                    id="chord-root"
                    style={{ width: 48 }}
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

            <hr className="toolbar-divider" />

            <div className="toolbar-columns">
                <button
                    onClick={() => setEditingMode("setSingleColumn")}>
                    <FormatAlignJustify fontSize="small" />
                </button>
                <button
                    onClick={() => setEditingMode("setDualColumn")}>
                    <VerticalSplit fontSize="medium" />
                </button>
            </div>
        </div>
    )
}
