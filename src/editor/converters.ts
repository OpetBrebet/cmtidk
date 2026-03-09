import type { Document as DocumentType, FirestoreDocument as FirestoreDocType } from "./types.ts"

export function documentToFirestore(doc: DocumentType): FirestoreDocType {
    return {
        createdAt: doc.createdAt,

        title: doc.title,
        artist: doc.artist,

        musicRoot: doc.musicRoot,
        lines: doc.lines.map(line => ({
            id: line.id,
            text: line.text,
            chords: line.chords
        }))
    }
}

export function firestoreToDocument(doc: FirestoreDocType): DocumentType {
    return {
        id: "",
        createdAt: doc.createdAt,

        title: doc.title,
        artist: doc.artist,

        musicRoot: doc.musicRoot,
        lines: doc.lines.map(line => ({
            id: line.id,
            text: line.text,
            chords: line.chords,
            isEditing: false
        })),
        draftChord: {
            id: "",
            index: 0,
            root: 0,
            type: ""
        }
    }
}

