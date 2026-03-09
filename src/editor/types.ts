import type { FieldValue, Timestamp } from "firebase/firestore/lite"

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
    isEditing: boolean
}

export type Document = {
    id: string
    createdAt: Timestamp | FieldValue

    title: string
    artist: string

    musicRoot: number
    lines: Line[]
    draftChord: Chord
}

export type FirestoreLine = {
    id: string
    text: string
    chords: Chord[]
}

export type FirestoreDocument = {
    createdAt: Timestamp | FieldValue

    title: string
    artist: string

    musicRoot: number
    lines: FirestoreLine[]
}
