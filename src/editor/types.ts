export type Chord = {
    id: string
    index: number
    root: number    // Starts on C
    type: string
}

export type Line = {
    id: string
    text: string
    chords: Chord[]
}

export type Margins = {
    top: number,
    bottom: number,
    left: number,
    right: number
}

export type DocSettings = {
    fontSize: number
    padding: number
    margins: Margins
}

export type Document = {
    id: string
    createdAt: number
    docSettings: DocSettings

    title: string
    artist: string

    musicRoot: number
    lines: Line[]
}

export type FirestoreDocument = {
    createdAt: number
    docSettings: DocSettings

    title: string
    artist: string

    musicRoot: number
    lines: Line[]
}

export type EditorState = {
    draftChord: Chord
    editingId: string | null
}
