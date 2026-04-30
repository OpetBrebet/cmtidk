import { useState } from "react";
import { useDoc } from "../DocContext";
import { createLine, createLineGroup, createSection } from "../factories";

export default function ImportText() {
    const { currentDoc, setCurrentDoc } = useDoc()
    const [text, setText] = useState("")

    const onImportClick = () => {
        const lines = text.split("\n").filter(line => line.trim() !== "")

        const section = currentDoc.sections.at(-1)

        if (!section) return

        if (section.lineGroups.length === 1) {
            setCurrentDoc(prev => ({
                ...prev,
                sections: currentDoc.sections.map(s =>
                    s.id === section.id ? {
                        ...s,
                        lineGroups: [{
                            ...s.lineGroups[0],
                            lines: [
                                ...s.lineGroups[0].lines,
                                ...lines.map(line => ({
                                    ...createLine(),
                                    text: line
                                }))
                            ]
                        }]
                    } : s
                )
            }))
        } else if (section.lineGroups.length > 1) {
            setCurrentDoc(prev => ({
                ...prev,
                sections: [
                    ...prev.sections,
                    {
                        ...createSection(),
                        lineGroups: [{
                            ...createLineGroup(),
                            lines: [
                                ...lines.map(line => ({
                                    ...createLine(),
                                    text: line
                                }))
                            ]
                        }]
                    }
                ]
            }))
        }
    }

    return (
        <>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button
                onClick={onImportClick}>
                Import
            </button>
        </>
    )
}
