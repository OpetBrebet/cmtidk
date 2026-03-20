import { DEFAULT_DOCUMENT } from "./defaults.ts"
import type { Document as DocumentType, FirestoreDocument as FirestoreDocType } from "./types.ts"

export function documentToFirestore(doc: DocumentType): FirestoreDocType {
    return {
        createdAt: doc.createdAt,
        docSettings: doc.docSettings,

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

export function firestoreToDocument(doc: any): DocumentType {
    return {
        ...DEFAULT_DOCUMENT,
        ...doc
    }
}

