import {
    NOTES,
    numberToNote,
    noteToNumber
} from "../lib/music.ts"

import type {
    Chord as ChordType,
    Document as DocumentType
} from "./types.ts"

type ToolbarFunction = {
    document: (DocumentType)
    setDocument: React.Dispatch<React.SetStateAction<DocumentType>>
}

export default function Toolbar({
    document,
    setDocument
}: ToolbarFunction) {
    const setMusicRoot = (musicRoot: number) => {
        setDocument(prev => ({
            ...prev,
            musicRoot: musicRoot
        }))
    }

    const setChordRoot = (chordRoot: number) => {
        setDocument(prev => ({
            ...prev,
            draftChord: {
                ...prev.draftChord,
                root: chordRoot
            }
        }))
    }

    const setChordType = (chordType: string) => {
        setDocument(prev => ({
            ...prev,
            draftChord: {
                ...prev.draftChord,
                type: chordType
            }
        }))
    }

    return (
        <div className="toolbar">
            <div className="toolbar-music">
                <select name="music-root" id="music-root"
                    value={numberToNote(document.musicRoot)}
                    onChange={(e) => {
                        const value = noteToNumber(e.target.value)
                        setMusicRoot(value)
                    }}
                >
                    {NOTES.map(note => (
                        <option key={note} value={note}>
                            {note}
                        </option>
                    ))}
                </select>
            </div>
            <div className="toolbar-chords">
                <select name="chord-root" id="chord-root"
                    value={
                        numberToNote(document.draftChord.root + document.musicRoot)
                    }
                    onChange={(e) => {
                        const value = noteToNumber(e.target.value)
                        setChordRoot(value - document.musicRoot)
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
                    value={document.draftChord.type}
                    onChange={(e) => {
                        setChordType(e.target.value)
                    }}
                    placeholder="Chord (e.g. Am, G7)"
                />
            </div>
        </div>
    )
}
