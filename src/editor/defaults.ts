import type { Document, DocSettings, Chord, Line, Margins } from "./types"

export const DEFAULT_LINE: Line = {
    id: crypto.randomUUID(),
    text: "",
    chords: []
}

export const DEFAULT_CHORD: Chord = {
    id: "",
    index: 0,
    root: 0,
    type: ""
}

export const DEFAULT_MARGINS: Margins = {
    top: 16,
    right: 16,
    bottom: 16,
    left: 16
}

export const DEFAULT_DOC_SETTINGS: DocSettings = {
    fontSize: 11,
    padding: 4,
    margins: DEFAULT_MARGINS
}

export const DEFAULT_DOCUMENT: Document = {
    id: "",
    createdAt: Date.now(),
    docSettings: DEFAULT_DOC_SETTINGS,

    title: "",
    artist: "",

    musicRoot: 0,
    lines: [DEFAULT_LINE],
    draftChord: DEFAULT_CHORD
}
