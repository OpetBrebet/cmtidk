import type { Document, DocSettings, Chord, Line, Margins, EditorState, LineGroup, Section } from "./types"

export const DEFAULT_LINE: Line = {
    id: crypto.randomUUID(),
    text: "",
    chords: []
}

export const DEFAULT_LINE_GROUP: LineGroup = {
    id: crypto.randomUUID(),
    lines: [DEFAULT_LINE]
}

export const DEFAULT_SECTION: Section = {
    id: crypto.randomUUID(),
    lineGroups: [DEFAULT_LINE_GROUP]
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
    sections: [DEFAULT_SECTION]
}

export const DEFAULT_EDITOR_STATE: EditorState = {
    draftChord: DEFAULT_CHORD,
    editingId: null,
    editingMode: null
}
