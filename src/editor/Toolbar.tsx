import {
    NOTES,
    numberToNote,
    noteToNumber
} from "../lib/music.ts"

import type { Document as DocumentType } from "./types.ts"

type ToolbarFunction = {
    currentDoc: (DocumentType)
    setCurrentDoc: React.Dispatch<React.SetStateAction<DocumentType>>
}

export default function Toolbar({
    currentDoc,
    setCurrentDoc
}: ToolbarFunction) {
    const setMusicRoot = (musicRoot: number) => {
        setCurrentDoc(prev => ({
            ...prev,
            musicRoot: musicRoot
        }))
    }

    const setChordRoot = (chordRoot: number) => {
        setCurrentDoc(prev => ({
            ...prev,
            draftChord: {
                ...prev.draftChord,
                root: chordRoot
            }
        }))
    }

    const setChordType = (chordType: string) => {
        setCurrentDoc(prev => ({
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
                    value={numberToNote(currentDoc.musicRoot)}
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
                        numberToNote(currentDoc.draftChord.root + currentDoc.musicRoot)
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
                    value={currentDoc.draftChord.type}
                    onChange={(e) => {
                        setChordType(e.target.value)
                    }}
                    placeholder="Chord (e.g. Am, G7)"
                />
            </div>
        </div>
    )
}
