import {
    useRef,
    useLayoutEffect,
    useState
} from "react"

import { numberToNote } from "../lib/music"
import type { Line as LineType } from "./types.ts"

export default function Line({
    line,
    musicRoot,
    onTextChange,
    onStartEdit,
    onStopEdit,
    onCharClick,
    onChordClick
}: {
    line: LineType
    musicRoot: number
    onTextChange: (id: string, text: string) => void
    onStartEdit: (id: string) => void
    onStopEdit: (id: string) => void
    onCharClick: (charIndex: number) => void
    onChordClick: (chordId: string) => void
}) {
    const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
    const containerRef = useRef<HTMLDivElement | null>(null)
    const editRef = useRef<HTMLDivElement | null>(null)

    const [positions, setPositions] = useState<Record<string, number>>({})

    useLayoutEffect(() => {
        if (line.isEditing) return

        const measure = () => {
            if (!containerRef.current) return

            const containerRect = containerRef.current.getBoundingClientRect()
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
    }, [line.text, line.chords, line.isEditing])

    function finishEditing() {
        if (!editRef.current) return

        const text = editRef.current.textContent ?? ""
        onTextChange(line.id, text)
        onStopEdit(line.id)
    }

    return (
        <>
            {line.isEditing ? (
                <div className="line-container">
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
                                onStopEdit(line.id)
                            }
                        }}
                    >
                        {line.text}
                    </div>
                </div>
            ) : (
                <div className="line-container editing" ref={containerRef}>
                    <div className="chord-layer">
                        {line.chords.map(chord =>
                            <span
                                key={chord.id}
                                className="chord"
                                style={{ left: positions[chord.id] ?? 0 }}
                                onClick={() => onChordClick(chord.id)}
                            >
                                {numberToNote(chord.root + musicRoot)}{chord.type}
                            </span>
                        )}
                    </div>
                    <div className="text-layer">
                        {line.text.split("").map((char, i) => (
                            <span
                                key={i}
                                ref={el => { (letterRefs.current[i] = el) }}
                                onClick={() => onCharClick(i)}
                                className="letter"
                            >
                                {char}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/*Toggle Edit*/}
            <button
                className="edit-button"
                onClick={() => {
                    if (line.isEditing) {
                        finishEditing()
                    } else {
                        onStartEdit(line.id)
                    }
                }}
            >
                {line.isEditing ? "Save" : "Edit"}
            </button>
        </>
    )
}
