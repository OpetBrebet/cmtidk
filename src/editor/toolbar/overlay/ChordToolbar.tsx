import { useDoc } from "../../DocContext"
import { NOTES, noteToNumber, numberToNote } from "../../../lib/music"

import "./ChordToolbar.css"

export default function ChordToolbar() {
    const { currentDoc, editorState, setEditorState } = useDoc()

    const setChordRoot = (chordRoot: number) => {
        setEditorState(prev => ({
            ...prev,
            draftChord: {
                ...prev.draftChord,
                root: chordRoot
            }
        }))
    }

    const setChordType = (chordType: string) => {
        setEditorState(prev => ({
            ...prev,
            draftChord: {
                ...prev.draftChord,
                type: chordType
            }
        }))
    }

    return (
        <div className="chord-toolbar">
            <select
                name="chord-root"
                id="chord-root"
                style={{ width: 48 }}
                value={
                    numberToNote(editorState.draftChord.root + currentDoc.musicRoot)
                }
                onChange={(e) => {
                    const value = noteToNumber(e.target.value)
                    setChordRoot(value - currentDoc.musicRoot)
                }}
            >
                {NOTES.map(note => (
                    <option key={note} value={note}>
                        {note}
                    </option>
                ))}
            </select>
            <input
                type="text"
                value={editorState.draftChord.type}
                onChange={(e) => {
                    setChordType(e.target.value)
                }}
                placeholder="Chord Modifier (e.g. m, dim)"
            />
        </div>
    )
}
