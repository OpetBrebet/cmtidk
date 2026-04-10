import { createPortal } from "react-dom"
import { useState } from "react"
import { FormatAlignJustify, PlaylistAdd, Settings, VerticalSplit } from "@mui/icons-material"

import {
    NOTES,
    numberToNote,
    noteToNumber
} from "../../lib/music.ts"
import ProjectSettings from "./ProjectSettings.tsx"
import { useDoc } from "../DocContext.tsx"
import Overlay from "./overlay/Overlay.tsx"
import type { EditingMode as EditingModeType } from "../types.ts"

import "./Toolbar.css"

export default function Toolbar() {
    const { currentDoc, editorState, setEditorState } = useDoc()
    const [isPSOpen, setIsPSOpen] = useState(false) // PS is Project Settings

    const setEditingMode = (editingMode: EditingModeType) => {
        setEditorState(prev => ({
            ...prev,
            editingMode: editingMode
        }))
    }

    return (
        <div className="toolbar">
            <div className="toolbar-contents">
                <div className="toolbar-project-settings">
                    <button
                        className="toolbar-settings-button"
                        onClick={() => setIsPSOpen(true)}
                    >
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

                <div className="toolbar-add-chord-mode">
                    <button
                        onClick={() => setEditingMode("addChords")}
                    >
                        Add Chords
                    </button>
                </div>

                <hr className="toolbar-divider" />

                <div className="toolbar-columns">
                    <button
                        onClick={() => setEditingMode("setSingleColumn")}
                    >
                        <FormatAlignJustify fontSize="small" />
                    </button>
                    <button
                        onClick={() => setEditingMode("setDualColumn")}
                    >
                        <VerticalSplit fontSize="medium" />
                    </button>
                </div>

                <hr className="toolbar-divider" />

                <div className="toolbar-add-line">
                    <button
                        onClick={() => setEditingMode("addLine")}
                    >
                        <PlaylistAdd fontSize="medium" />
                    </button>
                </div>
            </div>

            <Overlay />
        </div>
    )
}
