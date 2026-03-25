import Section from "./Section.tsx"
import { useDoc } from "../DocContext.tsx"

import "./Page.css"
import type { Section as SectionType } from "../types.ts"
import { createLine, createSection } from "../factories.ts"

type AddLineProps = {
    section?: SectionType
}

function AddLine({ section }: AddLineProps) {
    const { setCurrentDoc } = useDoc()


    const onAddLineClick = () => {
        setCurrentDoc(prev => {
            const sections = prev.sections
            const sectionIndex = section
                ? sections.findIndex(s => s.id === section.id)
                : 0
            const target = sections[sectionIndex]

            if (!section) { // if called from the top, add line/section before the existing ones
                if (target.lineGroups.length === 1) {
                    return {
                        ...prev,
                        sections: sections.map((s, i) =>
                            i === sectionIndex ? {
                                ...s,
                                lineGroups: [{
                                    ...s.lineGroups[0],
                                    lines: [createLine(), ...s.lineGroups[0].lines]
                                }]
                            } : s
                        )
                    }
                }
                return {
                    ...prev,
                    sections: sections.flatMap((s, i) =>
                        i === sectionIndex ? [createSection(), s] : [s]
                    )
                }
            } else {
                if (target.lineGroups.length === 1) {
                    return {
                        ...prev,
                        sections: sections.map((s, i) =>
                            i === sectionIndex ? {
                                ...s,
                                lineGroups: [{
                                    ...s.lineGroups[0],
                                    lines: [...s.lineGroups[0].lines, createLine()]
                                }]
                            } : s
                        )
                    }
                }
            }

            const nextSection = sections[sectionIndex + 1]
            if (nextSection?.lineGroups.length === 1) {
                return {
                    ...prev,
                    sections: sections.map((s, i) =>
                        i === sectionIndex + 1 ? {
                            ...s,
                            lineGroups: [{
                                ...s.lineGroups[0],
                                lines: [createLine(), ...s.lineGroups[0].lines]
                            }]
                        } : s
                    )
                }
            }

            return {
                ...prev,
                sections: sections.flatMap((s, i) =>
                    i === sectionIndex ? [s, createSection()] : [s]
                )
            }
        })
    }

    return (
        <div className="section-add-line-pos">
            <div className="section-add-line-offset">
                <button onClick={onAddLineClick}>
                    Add Line
                </button>
            </div>
        </div>
    )
}

export default function Page() {
    const { currentDoc } = useDoc()

    return (
        <div className="page" style={{
            fontSize: currentDoc.docSettings.fontSize,
            paddingTop: `${currentDoc.docSettings.margins.top}mm`,
            paddingRight: `${currentDoc.docSettings.margins.right}mm`,
            paddingBottom: `${currentDoc.docSettings.margins.bottom}mm`,
            paddingLeft: `${currentDoc.docSettings.margins.left}mm`
        }}>
            <AddLine />
            {currentDoc.sections.map(section => (
                <div
                    key={section.id}
                    className="section-container"
                >
                    <Section
                        key={section.id}
                        section={section}
                    />
                    <AddLine
                        section={section}
                    />
                </div>
            ))}
        </div>
    )
}
