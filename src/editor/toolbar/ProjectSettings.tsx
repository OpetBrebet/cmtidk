import { useState } from "react"
import { NOTES, numberToNote, noteToNumber } from "../../lib/music"
import { useDoc } from "../DocContext"

import "./ProjectSettings.css"

export default function ProjectSettings() {
    const { currentDoc, setCurrentDoc } = useDoc()
    const [marginInputs, setMarginInputs] = useState({
        top: String(currentDoc.docSettings.margins.top),
        right: String(currentDoc.docSettings.margins.right),
        bottom: String(currentDoc.docSettings.margins.bottom),
        left: String(currentDoc.docSettings.margins.left),
    })

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

    const setFontSize = (fontSize: number) => {
        setCurrentDoc(prev => ({
            ...prev,
            docSettings: {
                ...prev.docSettings,
                fontSize: fontSize
            }
        }))
    }

    const setLineHeight = (lineHeight: number) => {
        setCurrentDoc(prev => ({
            ...prev,
            docSettings: {
                ...prev.docSettings,
                lineHeight: lineHeight
            }
        }))
    }

    const setMargin = (side: 'top' | 'right' | 'bottom' | 'left', margin: number) => {
        setCurrentDoc(prev => ({
            ...prev,
            docSettings: {
                ...prev.docSettings,
                margins: {
                    ...prev.docSettings.margins,
                    [side]: margin
                }
            }
        }))
    }

    return (
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
                <select
                    name="music-root"
                    id="music-root"
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
            <div className="font-size">
                <span>Font Size</span>
                <input
                    type="number"
                    value={currentDoc.docSettings.fontSize}
                    onChange={(e) => {
                        setFontSize(Number(e.target.value))
                    }}
                />
            </div>
            <div className="line-height">
                <span>Line Height</span>
                <input
                    type="number"
                    step="0.05"
                    value={currentDoc.docSettings.lineHeight}
                    onChange={(e) => {
                        setLineHeight(Number(e.target.value))
                    }}
                />
            </div>
            <div className="margins">
                <span>Margins</span>
                <div className="margin-inputs">
                    <div className="margin-input-top">
                        <span>Top</span>
                        <input
                            type="number"
                            value={marginInputs.top}
                            onChange={(e) => {
                                setMarginInputs(prev => ({ ...prev, top: e.target.value }))
                                setMargin('top', Number(e.target.value))
                            }}
                        />
                    </div>
                    <div className="margin-input-right">
                        <span>Right</span>
                        <input
                            type="number"
                            value={marginInputs.right}
                            onChange={(e) => {
                                setMarginInputs(prev => ({ ...prev, right: e.target.value }))
                                setMargin('right', Number(e.target.value))
                            }}
                        />
                    </div>
                    <div className="margin-input-bottom">
                        <span>Bottom</span>
                        <input
                            type="number"
                            value={marginInputs.bottom}
                            onChange={(e) => {
                                setMarginInputs(prev => ({ ...prev, bottom: e.target.value }))
                                setMargin('bottom', Number(e.target.value))
                            }}
                        />
                    </div>
                    <div className="margin-input-left">
                        <span>Left</span>
                        <input
                            type="number"
                            value={marginInputs.left}
                            onChange={(e) => {
                                setMarginInputs(prev => ({ ...prev, left: e.target.value }))
                                setMargin('left', Number(e.target.value))
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
