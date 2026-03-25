import { createLineGroup } from "../factories"
import { useDoc } from "../DocContext"
import LineGroup from "./LineGroup"
import type { Section as SectionType } from "../types"

import "./Section.css"

type SectionProps = {
    section: SectionType
}

export default function Section({ section }: SectionProps) {
    const { setCurrentDoc, editorState, setEditorState } = useDoc()

    const isSelectable = (editorState.editingMode === 'setSingleColumn') || (editorState.editingMode === 'setDualColumn')

    const setSection = (sectionId: string, newSection: SectionType) => {
        setCurrentDoc(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId ? {
                    ...newSection
                } : s
            )
        }))
    }

    const onSectionClick = (sectionId: string) => {
        if (!isSelectable) return

        setEditorState(prev => ({ ...prev, editingMode: null }))

        if (editorState.editingMode === 'setSingleColumn') {
            if (section.lineGroups.length === 1) return

            setSection(sectionId, {
                ...section,
                lineGroups: [{
                    ...section.lineGroups[0],
                    lines: [
                        ...section.lineGroups[0].lines,
                        ...section.lineGroups[1].lines
                    ]
                }]
            })
        } else if (editorState.editingMode === 'setDualColumn') {
            if (section.lineGroups.length !== 1) return

            setSection(sectionId, {
                ...section,
                lineGroups: [
                    ...section.lineGroups,
                    createLineGroup()
                ]
            })
        }
    }

    return (
        <div
            className={`section-wrapper ${isSelectable ? 'selectable' : ''}`}
            onClick={() => onSectionClick(section.id)}
        >
            {section.lineGroups.map(lineGroup => (
                <LineGroup
                    key={lineGroup.id}
                    lineGroup={lineGroup}
                    sectionId={section.id}
                />
            ))}
        </div>
    )
}
