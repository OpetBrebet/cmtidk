import {
    useRef,
    useLayoutEffect,
    useState
} from "react"

import { numberToNote } from "../../lib/music"
import type { Document as DocumentType, Line as LineType, Chord as ChordType } from "../types.ts"
import { Add, Check, DeleteOutline, Edit } from "@mui/icons-material"
import { DEFAULT_LINE } from "../defaults.ts"

export default function Line({
    line,
    currentDoc,
    setCurrentDoc,
    editingId,
    setEditingId
}: {
    line: LineType,
    currentDoc: DocumentType
    setCurrentDoc: React.Dispatch<React.SetStateAction<DocumentType>>
    editingId: string | null
    setEditingId: React.Dispatch<React.SetStateAction<string | null>>
}) {
    const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
    const chordLayerRef = useRef<HTMLDivElement | null>(null)
    const editRef = useRef<HTMLDivElement | null>(null)

    const [positions, setPositions] = useState<Record<string, number>>({})

    const isEditing = editingId === line.id

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

    const onTextChange = (newText: string) => {
        setCurrentDoc(prev => ({
            ...prev,
            lines: prev.lines.map(l =>
                l.id === line.id
                    ? { ...l, text: newText }
                    : l
            )
        }))
    }

    const addLine = () => {
        const id = crypto.randomUUID()

        setCurrentDoc(prev => ({
            ...prev,
            lines: prev.lines.flatMap(l =>
                l.id === line.id
                    ? [l, { ...DEFAULT_LINE, id: id }]
                    : [l]
            )
        }))
        setEditingId(id)
    }

    const deleteLine = () => {
        if (currentDoc.lines.length === 1) return

        setCurrentDoc(prev => ({
            ...prev,
            lines: prev.lines.filter(l => l.id !== line.id)
        }))
    }

    const onStartEdit = () => {
        setEditingId(line.id)
    }

    const onStopEdit = () => {
        setEditingId(null)
    }

    const finishEditing = () => {
        if (!editRef.current) return

        const text = editRef.current.textContent ?? ""
        onTextChange(text)
        onStopEdit()
    }

    const addChord = (newChord: ChordType) => {
        setCurrentDoc(prev => ({
            ...prev,
            lines: prev.lines.map(l =>
                l.id === line.id
                    ? { ...l, chords: [...l.chords, newChord] }
                    : l
            )
        }))
    }

    const onChordClick = (chordId: string) => {
        setCurrentDoc(prev => ({
            ...prev,
            lines: prev.lines.map(l =>
                l.id === line.id
                    ? {
                        ...l,
                        chords: l.chords.filter(chord => chord.id !== chordId)
                    }
                    : l
            )
        }))
    }

    const onCharClick = (charIndex: number) => {
        if (currentDoc.draftChord === null) return

        const newChord = {
            ...currentDoc.draftChord,
            id: crypto.randomUUID(),
            index: charIndex
        }

        addChord(newChord)
    }

    return (
        <>
            <div
                key={line.id}
                className={`line-wrapper ${isEditing && 'editing'}`}
            >
                {isEditing ? (
                    <div className="line-container editing">
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
                    </div>
                ) : (
                    <div className="line-container">
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
                    </div>
                )}

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
            </div>
        </>
    )
}
