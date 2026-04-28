import { Add, ArrowDownward, ArrowUpward, Check, DeleteOutline } from "@mui/icons-material"

import { useDoc } from "../DocContext"
import { createLine } from "../factories"
import type { Line as LineType, LineGroup as LineGroupType, Section as SectionType } from "../types"

import "./LineToolbar.css"

type LineToolbarProps = {
    line: LineType
    lineGroup: LineGroupType
    section: SectionType

}

export default function LineToolbar({ line, lineGroup, section }: LineToolbarProps) {
    const { currentDoc, setCurrentDoc, editorState, setEditorState } = useDoc()

    const isVisible = (editorState.editingMode === null) && (editorState.editingLineId === line.id)

    const setSection = (newSection: SectionType) => {
        setCurrentDoc(prev => ({
            ...prev,
            sections: currentDoc.sections.map(s =>
                s.id === section.id ? {
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
                lg.id === lineGroup.id ? {
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

    const moveLine = (direction: "up" | "down") => {
        if (!lineGroup || !line) return

        const index = lineGroup.lines.findIndex(l => l.id === line.id)
        if (index === -1) return

        const targetIndex = direction === 'up' ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= lineGroup.lines.length) return

        const newArray = [...lineGroup.lines];
        [newArray[index], newArray[targetIndex]] = [newArray[targetIndex], newArray[index]]

        setLineGroup({
            ...lineGroup,
            lines: newArray
        })
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
            editingLineId: null
        }))
    }

    return (
        <div className={`line-toolbar-wrapper ${isVisible && 'visible'}`}>
            <button
                className="button-add-line"
                onClick={addLine}
            >
                <Add fontSize="small" />
            </button>
            <button
                className="button-move-line-up"
                onClick={() => moveLine("up")}
            >
                <ArrowUpward fontSize="small" />
            </button>
            <button
                className="button-move-line-down"
                onClick={() => moveLine("down")}
            >
                <ArrowDownward fontSize="small" />
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
    )
}
