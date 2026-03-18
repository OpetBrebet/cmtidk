import type { Document as DocumentType } from "./types"
import { NOTES, numberToNote, noteToNumber } from "../lib/music"

import "./ProjectSettings.css"
import { Close } from "@mui/icons-material"

type ProjectSettingsProps = {
    currentDoc: (DocumentType)
    setCurrentDoc: React.Dispatch<React.SetStateAction<DocumentType>>
    setIsPSOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ProjectSettings({
    currentDoc,
    setCurrentDoc,
    setIsPSOpen
}: ProjectSettingsProps) {
    const setMusicTitle = (title: string) => {
        setCurrentDoc(prev => ({
            ...prev,
            title: title
        }))
    }

    const setMusicArtist = (artist: string) => {
        setCurrentDoc(prev => ({
            ...prev,
            artist: artist
        }))
    }

    const setMusicRoot = (musicRoot: number) => {
        setCurrentDoc(prev => ({
            ...prev,
            musicRoot: musicRoot
        }))
    }

    return (
        <div
            onClick={() => setIsPSOpen(false)} // Close if there is a click on the overlay
            className="ps-modal-overlay"
        >
            <div
                onClick={(e) => e.stopPropagation()} // Don't close on click inside the modal
                className="ps-modal-box"
            >
                <div className="ps-modal-header">
                    <div className="ps-modal-title">
                        Music Settings
                    </div>
                    <button
                        onClick={() => setIsPSOpen(false)}
                        className="ps-modal-close"
                    >
                        <Close sx={{ fontSize: 32 }} />
                    </button>
                </div>
                <hr className="ps-modal-divider" />
                <div className="ps-modal-items">
                    <div className="music-title">
                        <span>Title</span>
                        <input
                            type="text"
                            value={currentDoc.title}
                            onChange={(e) => {
                                setMusicTitle(e.target.value)
                            }}
                            placeholder="Set the title"
                        />
                    </div>
                    <div className="music-artist">
                        <span>Artist</span>
                        <input
                            type="text"
                            value={currentDoc.artist}
                            onChange={(e) => {
                                setMusicArtist(e.target.value)
                            }}
                            placeholder="Set the artist"
                        />
                    </div>
                    <div className="music-root">
                        <span>Root Note</span>
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
                </div>
            </div>
        </div >
    )
}
