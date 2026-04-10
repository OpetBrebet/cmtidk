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
    splitOffset: number
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

export type ToolbarProperties = {
    lineId: string | null
    lineGroupId: string | null
    sectionId: string | null
    lineTop: number | null
    lineLeft: number | null
    lineWidth: number | null
}

export type EditingMode =
    'setSingleColumn' |
    'setDualColumn' |
    'addLine' |
    'addChords' |
    null

export const EDITING_MODE_LABELS: Record<NonNullable<EditingMode>, string> = {
    setSingleColumn: 'Set as Single Column',
    setDualColumn: 'Set as Dual Column',
    addLine: 'Add a Line',
    addChords: 'Add Chords'
}

export type EditorState = {
    draftChord: Chord
    editingMode: EditingMode
    toolbarProperties: ToolbarProperties
}
