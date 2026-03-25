import {
    useRef,
    useLayoutEffect,
    useState
} from "react"
import { Add, Check, DeleteOutline, Edit } from "@mui/icons-material"

import { numberToNote } from "../../lib/music"
import { useDoc } from "../DocContext.tsx"
import type { LineGroup as LineGroupType, Line as LineType, Chord as ChordType, Section as SectionType } from "../types.ts"

import "./Line.css"
import { createLine } from "../factories.ts"

type LineProps = {
    line: LineType,
    lineGroupId: string,
    sectionId: string
}

export default function Line({
    line,
    lineGroupId,
    sectionId
}: LineProps) {
    const { currentDoc, setCurrentDoc, editorState, setEditorState } = useDoc()

    const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
    const chordLayerRef = useRef<HTMLDivElement | null>(null)
    const editRef = useRef<HTMLDivElement | null>(null)

    const [positions, setPositions] = useState<Record<string, number>>({})

    const section = currentDoc.sections.find(s => s.id === sectionId)
    if (!section) throw new Error(`Section ${sectionId} not found`)

    const lineGroup = section.lineGroups.find(lg => lg.id === lineGroupId)
    if (!lineGroup) throw new Error(`LineGroup ${lineGroupId} not found`)

    const isEditing = editorState.editingId === line.id
    const isSelectable = editorState.editingMode === null

    useLayoutEffect(() => {
        if (isEditing) return

        const measure = () => {
            if (!chordLayerRef.current) return

            const containerRect = chordLayerRef.current.getBoundingClientRect()
            const newPositions: Record<string, number> = {}

            line.chords.forEach(chord => {
                const letterEl = letterRefs.current[chord.index]
                if (!letterEl) return

                const rect = letterEl.getBoundingClientRect()
                newPositions[chord.id] = rect.left - containerRect.left
            })

            setPositions(newPositions)
        }

        requestAnimationFrame(measure)
    }, [line.text, line.chords, isEditing, currentDoc.docSettings])

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
        setSection({
            ...section,
            lineGroups: section.lineGroups.map(lg =>
                lg.id === lineGroupId ? {
                    ...newLineGroup
                } : lg
            )
        })
    }

    const onTextChange = (newText: string) => {
        setLineGroup({
            ...lineGroup,
            lines: lineGroup.lines.map(l =>
                l.id === line.id ? { ...l, text: newText } : l
            )
        })
    }

    const addLine = () => {
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

    const onStartEdit = () => {
        setEditorState(prev => ({ ...prev, editingId: line.id }))
    }

    const onStopEdit = () => {
        setEditorState(prev => ({ ...prev, editingId: null }))
    }

    const finishEditing = () => {
        if (!editRef.current) return

        const text = editRef.current.textContent ?? ""
        onTextChange(text)
        onStopEdit()
    }

    const addChord = (newChord: ChordType) => {
        setLineGroup({
            ...lineGroup,
            lines: lineGroup.lines.map(l =>
                l.id === line.id ? {
                    ...l,
                    chords: [...l.chords, newChord]
                } : l
            )
        })
    }

    const onChordClick = (chordId: string) => {
        if (isSelectable === null) return

        setLineGroup({
            ...lineGroup,
            lines: lineGroup.lines.map(l =>
                l.id === line.id ? {
                    ...l,
                    chords: l.chords.filter(chord => chord.id !== chordId)
                } : l
            )
        })
    }

    const onCharClick = (charIndex: number) => {
        if (editorState.draftChord === null) return
        if (isSelectable === null) return

        const newChord = {
            ...editorState.draftChord,
            id: crypto.randomUUID(),
            index: charIndex
        }

        addChord(newChord)
    }

    return (
        <div
            className={
                `line-wrapper
                ${isEditing ? 'editing' : ''}
                ${isSelectable ? 'hoverable' : ''}`
            }
        >
            <div className="line-toolbar-sticky">
                <div className="line-toolbar">
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
                            if (isEditing) {
                                finishEditing()
                            } else {
                                onStartEdit()
                            }
                        }}
                    >
                        {isEditing ? <Check fontSize="small" /> : <Edit fontSize="small" />}
                    </button>
                </div>
            </div>

            {isEditing ? (
                <div
                    ref={editRef}
                    className="text-layer"
                    contentEditable
                    autoFocus
                    suppressContentEditableWarning
                    onBlur={() => finishEditing()}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            finishEditing()
                        } else if (e.key === "Escape") {
                            e.preventDefault()
                            onStopEdit()
                        }
                    }}
                >
                    {line.text}
                </div>
            ) : (
                <>
                    <div className="chord-layer" ref={chordLayerRef}>
                        {line.chords.map(chord =>
                            <span
                                key={chord.id}
                                className={`chord ${isSelectable ? 'selectable' : ''}`}
                                style={{ left: positions[chord.id] ?? 0 }}
                                onClick={() => onChordClick(chord.id)}
                            >
                                {numberToNote(chord.root + currentDoc.musicRoot)}{chord.type}
                            </span>
                        )}
                    </div>
                    <div className="text-layer">
                        {line.text ? line.text.split("").map((char, i) => (
                            <span
                                key={i}
                                ref={el => { (letterRefs.current[i] = el) }}
                                onClick={() => onCharClick(i)}
                                className={`letter ${isSelectable ? 'selectable' : ''}`}
                            >
                                {char}
                            </span>
                        )) :
                            <span className="placeholder">Edit this line to change text</span>
                        }
                    </div>
                </>
            )}
        </div>
    )
}
