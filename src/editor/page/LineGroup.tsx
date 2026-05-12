import { useDoc } from '../DocContext'
import Line from "./line/Line"
import LineToolbar from "./line/LineToolbar"
import type { LineGroup as LineGroupType, Section as SectionType } from "../types"

import "./LineGroup.css"

type LineGroupProps = {
    lineGroup: LineGroupType
    section: SectionType
}

export default function LineGroup({ lineGroup, section }: LineGroupProps) {
    const { editorState } = useDoc()

    const isHoverable = editorState.editingMode === null

    return (
        <div className={`line-group`}>
            {lineGroup.lines.map(line => (
                <div
                    key={line.id}
                    className={`line-container ${isHoverable ? 'hoverable' : ''}`}
                >
                    <div
                        className={`line-toolbar-container`}
                        style={{
                            position: 'absolute'
                        }}
                    >
                        <LineToolbar
                            line={line}
                            lineGroup={lineGroup}
                            section={section}
                        />
                    </div>
                    <Line
                        key={line.id}
                        line={line}
                        lineGroup={lineGroup}
                        section={section}
                    />
                </div>
            ))}
        </div>
    )
}
