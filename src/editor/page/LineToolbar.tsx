import { Add, Check, DeleteOutline } from "@mui/icons-material"

import { useDoc } from "../DocContext"
import { createLine, createToolbarProperties } from "../factories"
import type { LineGroup as LineGroupType, Section as SectionType } from "../types"

import "./LineToolbar.css"

export default function LineToolbar({ }) {
    const { currentDoc, setCurrentDoc, editorState, setEditorState } = useDoc()

    const lineId = editorState.toolbarProperties.lineId
    const lineGroupId = editorState.toolbarProperties.lineGroupId
    const sectionId = editorState.toolbarProperties.sectionId
    const lineTop = editorState.toolbarProperties.lineTop
    const lineLeft = editorState.toolbarProperties.lineLeft
    const lineWidth = editorState.toolbarProperties.lineWidth

    const section = currentDoc.sections.find(s => s.id === sectionId)
    const lineGroup = section?.lineGroups.find(lg => lg.id === lineGroupId)
    const line = lineGroup?.lines.find(l => l.id === lineId)

    const isVisible = (lineId !== null) && (editorState.editingMode === null)

    const setSection = (newSection: SectionType) => {
        setCurrentDoc(prev => ({
            ...prev,
            sections: currentDoc.sections.map(s =>
                s.id === sectionId ? {
                    ...newSection
                } : s
            )
        }))
    }

    const setLineGroup = (newLineGroup: LineGroupType) => {
        if (!section) return
        setSection({
            ...section,
            lineGroups: section.lineGroups.map(lg =>
                lg.id === lineGroupId ? {
                    ...newLineGroup
                } : lg
            )
        })
    }

    const addLine = () => {
        if (!lineGroup || !line) return
        const newLine = createLine()

        setLineGroup({
            ...lineGroup,
            lines: lineGroup.lines.flatMap(l =>
                l.id === line.id ? [
                    l, newLine
                ] : [l]
            )
        })
        setEditorState(prev => ({ ...prev, editingId: newLine.id }))
    }

    const deleteLine = () => {
        if (!lineGroup || !section || !line) return

        if (
            currentDoc.sections.length === 1 &&
            currentDoc.sections[0]?.lineGroups.length === 1 &&
            currentDoc.sections[0]?.lineGroups[0]?.lines.length === 1
        ) return

        setLineGroup({
            ...lineGroup,
            lines: lineGroup.lines.filter(l => l.id !== line.id)
        })

        if (lineGroup.lines.length > 1) return

        setSection({
            ...section,
            lineGroups: section.lineGroups.filter(lg => lg.id !== lineGroup.id)
        })

        if (section.lineGroups.length > 1) return

        setCurrentDoc(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== section.id)
        }))
    }

    const onStopEdit = () => {
        if (!line) return

        setEditorState(prev => ({
            ...prev,
            toolbarProperties: createToolbarProperties()
        }))
    }

    return (
        <div
            className={`line-toolbar-container ${isVisible ? 'visible' : ''}`}
            style={{
                top: `${lineTop}px`,
                left: `${lineLeft}px`,
                width: `${lineWidth}px`
            }}
        >
            <div className="line-toolbar-wrapper">
                <button
                    className="button-add-line"
                    onClick={addLine}
                >
                    <Add fontSize="small" />
                </button>
                <button
                    className="button-delete-line"
                    onClick={deleteLine}
                >
                    <DeleteOutline fontSize="small" />
                </button>
                <button
                    className="button-edit-line"
                    onClick={() => {
                        onStopEdit()
                    }}
                >
                    <Check fontSize="small" />
                </button>
            </div>
        </div>
    )
}
