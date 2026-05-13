import { FormatAlignJustify, PersonAddAlt1, PlaylistAdd, PrintOutlined, Settings, VerticalSplit } from "@mui/icons-material"
import { useDoc } from "../DocContext.tsx"
import { useModal } from "../../context/ModalContext.tsx"
import Overlay from "./overlay/Overlay.tsx"
import ProjectSettings from "./ProjectSettings.tsx"
import ImportText from "./ImportText.tsx"
import ShareDocument from "./ShareDocument.tsx"
import type { EditingMode as EditingModeType } from "../types.ts"

import "./Toolbar.css"

export default function Toolbar() {
    const { setEditorState } = useDoc()
    const { openModal } = useModal()

    const setEditingMode = (editingMode: EditingModeType) => {
        setEditorState(prev => ({
            ...prev,
            editingMode: editingMode
        }))
    }

    const onPSClick = () => {
        openModal({
            title: "Project Settings",
            content: <ProjectSettings />
        })
    }

    const onITClick = () => {
        openModal({
            title: "Import Text",
            content: <ImportText />
        })
    }

    const onShareClick = () => {
        openModal({
            width: 720,
            title: "Share Document",
            content: <ShareDocument />
        })
    }

    return (
        <div className="toolbar">
            <div className="toolbar-contents">
                <div className="toolbar-project-settings">
                    <button className="toolbar-settings-button" onClick={onPSClick}>
                        <div>
                            <Settings />
                        </div>
                        Project Settings
                    </button>
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

                <hr className="toolbar-divider" />

                <div className="toolbar-import-text">
                    <button
                        onClick={() => onITClick()}
                    >
                        Import Text
                    </button>
                </div>

                <hr className="toolbar-divider" />

                <div className="toolbar-print">
                    <button
                        onClick={print}
                    >
                        <PrintOutlined />
                    </button>
                </div>

                <div className="toolbar-share">
                    <button
                        className="toolbar-share-button"
                        onClick={onShareClick}
                    >
                        <PersonAddAlt1 />
                        Share Document
                    </button>
                </div>
            </div>

            <Overlay />
        </div>
    )
}
