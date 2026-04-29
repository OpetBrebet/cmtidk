import type { Document, DocSettings, Chord, Line, Margins, EditorState, LineGroup, Section } from "./types"

export const createLine = (): Line => ({
    id: crypto.randomUUID(),
    text: "",
    chords: []
})

export const createLineGroup = (): LineGroup => ({
    id: crypto.randomUUID(),
    lines: [createLine()]
})

export const createSection = (): Section => ({
    id: crypto.randomUUID(),
    lineGroups: [createLineGroup()],
    splitOffset: 0
})

export const createChord = (): Chord => ({
    id: "",
    index: 0,
    root: 0,
    type: ""
})

export const createMargins = (): Margins => ({
    top: 16,
    right: 16,
    bottom: 16,
    left: 16
})

export const createDocSettings = (): DocSettings => ({
    fontSize: 11,
    padding: 4,
    lineHeight: 1.25,
    margins: createMargins()
})

export const createDocument = (): Document => ({
    id: "",
    docSettings: createDocSettings(),

    title: "",
    artist: "",

    musicRoot: 0,
    sections: [createSection()]
})

export const createEditorState = (): EditorState => ({
    draftChord: createChord(),
    editingMode: null,
    editingLineId: null
})
