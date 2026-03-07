export const NOTES = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
]

export function numberToNote(n: number): string {
    return NOTES[n % 12]
}

export function noteToNumber(n: string): number {
    return NOTES.indexOf(n)
}
