import type { LineGroup as LineGroupType, Section as SectionType, LineSettings as LineSettingsType } from "../../types"
import { useDoc } from "../../DocContext"

import "./LineSettings.css"

type LineSettingsProps = {
    lineId: string
    lineGroupId: string
    sectionId: string
}

export default function LineSettings({ lineId, lineGroupId, sectionId }: LineSettingsProps) {
    const { currentDoc, setCurrentDoc } = useDoc()

    const section = currentDoc.sections.find(s => s.id === sectionId)!
    const lineGroup = section.lineGroups.find(lg => lg.id === lineGroupId)!
    const line = lineGroup.lines.find(l => l.id === lineId)!

    const setSection = (newSection: SectionType) => {
        setCurrentDoc(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === section.id ? {
                    ...newSection
                } : s
            )
        }))
    }

    const setLineGroup = (newLineGroup: LineGroupType) => {
        setSection({
            ...section,
            lineGroups: section.lineGroups.map(lg =>
                lg.id === lineGroup.id ? {
                    ...newLineGroup
                } : lg
            )
        })
    }

    const setLineSettings = (partialSettings: Partial<LineSettingsType>) => {
        setLineGroup({
            ...lineGroup,
            lines: lineGroup.lines.map(l =>
                l.id === line.id ? {
                    ...l,
                    settings: {
                        ...l.settings,
                        ...partialSettings
                    }
                } : l
            )
        })
    }

    return (
        <div className="line-settings">
            <div className="ls-toggle">
                <button
                    className={`ls-toggle-bold toggle ${line.settings.bold === true ? "on" : "off"}`}
                    onClick={() => setLineSettings({ bold: !line.settings.bold })}
                >
                    B
                </button>

                <hr></hr>

                <button
                    className={`ls-toggle-italic toggle ${line.settings.italic === true ? "on" : "off"}`}
                    onClick={() => setLineSettings({ italic: !line.settings.italic })}
                >
                    I
                </button>

                <hr></hr>

                <button
                    className={`ls-toggle-underline toggle ${line.settings.underline === true ? "on" : "off"}`}
                    onClick={() => setLineSettings({ underline: !line.settings.underline })}
                >
                    U
                </button>
            </div>
        </div>
    )
} 
