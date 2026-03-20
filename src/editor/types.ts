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

export type LineGroup = {
    id: string
    lines: Line[]
}

export type Section = {
    id: string
    lineGroups: LineGroup[]
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
    sections: Section[]
}

export type FirestoreDocument = {
    createdAt: number
    docSettings: DocSettings

    title: string
    artist: string

    musicRoot: number
    sections: Section[]
}

export type EditorState = {
    draftChord: Chord
    editingId: string | null
}
