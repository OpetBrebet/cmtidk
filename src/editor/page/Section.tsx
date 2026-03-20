import LineGroup from "./LineGroup"
import type { Section as SectionType } from "../types"

type SectionProps = {
    section: SectionType
}

export default function Section({ section }: SectionProps) {
    return (
        <div key={section.id} className="section">
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
