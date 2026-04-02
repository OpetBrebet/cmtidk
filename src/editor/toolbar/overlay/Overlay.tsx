import { useDoc } from "../../DocContext"

import "./Overlay.css"
import { Close } from "@mui/icons-material"
import { EDITING_MODE_LABELS } from "../../types"

export default function Overlay() {
    const { editorState, setEditorState } = useDoc()
    const isVisible = editorState.editingMode !== null

    const editingModeName = editorState.editingMode && EDITING_MODE_LABELS[editorState.editingMode]

    const closeToolbar = () => {
        setEditorState(prev => ({
            ...prev,
            editingMode: null
        }))
    }

    return (
        <div
            className={`toolbar-overlay ${isVisible ? 'visible' : ''}`}
        >
            <button
                onClick={closeToolbar}
                style={{ display: "flex", alignItems: "center" }}
            >
                <Close />
            </button>
            <span
                style={{ fontSize: 16 }}
            >
                {editingModeName}
            </span>
        </div>
    )
}
