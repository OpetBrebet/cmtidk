import {
    useRef,
    useLayoutEffect,
    useState
} from "react"
import { Add, Check, DeleteOutline, Edit } from "@mui/icons-material"

import { numberToNote } from "../../lib/music"
import { DEFAULT_LINE } from "../defaults.ts"
import { useDoc } from "../DocContext.tsx"
import type { LineGroup as LineGroupType, Line as LineType, Chord as ChordType } from "../types.ts"

import "./Line.css"

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

    const setLineGroup = (newLineGroup: LineGroupType) => {
        setCurrentDoc(prev => ({
            ...prev,
            sections: currentDoc.sections.map(section =>
                section.id === sectionId ? {
                    ...section,
                    lineGroups: section.lineGroups.map(lineGroup =>
                        lineGroup.id === lineGroupId ? {
                            ...newLineGroup
                        } : lineGroup
                    )
                } : section
            )
        }))
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
        const id = crypto.randomUUID()

        setLineGroup({
            ...lineGroup,
            lines: lineGroup.lines.flatMap(l =>
                l.id === line.id ? [
                    l, { ...DEFAULT_LINE, id: id }
                ] : [l]
            )
        })
        setEditorState({ ...editorState, editingId: id })
    }

    const deleteLine = () => {
        setLineGroup({
            ...lineGroup,
            lines: lineGroup.lines.filter(l => l.id !== line.id)
        })
    }

    const onStartEdit = () => {
        setEditorState({ ...editorState, editingId: line.id })
    }

    const onStopEdit = () => {
        setEditorState({ ...editorState, editingId: null })
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
                l.id === line.id
                    ? { ...l, chords: [...l.chords, newChord] }
                    : l
            )
        })
    }

    const onChordClick = (chordId: string) => {
        setLineGroup({
            ...lineGroup,
            lines: lineGroup.lines.map(l =>
                l.id === line.id
                    ? {
                        ...l,
                        chords: l.chords.filter(chord => chord.id !== chordId)
                    }
                    : l
            )
        })
    }

    const onCharClick = (charIndex: number) => {
        if (editorState.draftChord === null) return

        const newChord = {
            ...editorState.draftChord,
            id: crypto.randomUUID(),
            index: charIndex
        }

        addChord(newChord)
    }

    return (
        <div className={`line-container ${isEditing && 'editing'}`}>
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
                                className="chord"
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
                                className="letter"
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
