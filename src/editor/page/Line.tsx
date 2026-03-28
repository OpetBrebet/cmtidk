import {
    useRef,
    useLayoutEffect,
    useState
} from "react"

import { numberToNote } from "../../lib/music"
import { useDoc } from "../DocContext.tsx"
import type { LineGroup as LineGroupType, Line as LineType, Chord as ChordType, Section as SectionType } from "../types.ts"

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

    const lineRef = useRef<(HTMLDivElement | null)>(null)
    const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
    const chordLayerRef = useRef<HTMLDivElement | null>(null)
    const editRef = useRef<HTMLDivElement | null>(null)

    const [positions, setPositions] = useState<Record<string, number>>({})

    const section = currentDoc.sections.find(s => s.id === sectionId)
    if (!section) throw new Error(`Section ${sectionId} not found`)

    const lineGroup = section.lineGroups.find(lg => lg.id === lineGroupId)
    if (!lineGroup) throw new Error(`LineGroup ${lineGroupId} not found`)

    const isEditing = editorState.toolbarProperties.lineId === line.id
    const isSelectable = (!isEditing) && (editorState.editingMode === null)

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

    const onLineClick = () => {
        const rect = lineRef.current?.getBoundingClientRect()
        setEditorState(prev => ({
            ...prev,
            toolbarProperties: {
                lineId: line.id,
                lineGroupId: lineGroupId,
                sectionId: sectionId,
                lineTop: rect?.top || null,
                lineLeft: rect?.left || null,
                lineWidth: rect?.width || null
            }
        }))
        console.log(editorState)
    }

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

    const onStopEdit = () => {
        setEditorState(prev => ({
            ...prev,
            toolbarProperties: {
                ...prev.toolbarProperties,
                lineId: line.id
            }
        }))
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
                ${isSelectable ? 'selectable' : ''}`
            }
            ref={lineRef}
            onClick={onLineClick}
        >

            {isEditing ? (
                <div
                    ref={editRef}
                    className="text-layer"
                    contentEditable
                    autoFocus
                    suppressContentEditableWarning
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
                            <span className="placeholder">Click this line to change text</span>
                        }
                    </div>
                </>
            )}
        </div>
    )
}
