import Line from "./Line"
import type { LineGroup as LineGroupType } from "../types"
import { useDoc } from '../DocContext'

import "./LineGroup.css"

type LineGroupProps = {
    lineGroup: LineGroupType
    sectionId: string
}

export default function LineGroup({ lineGroup, sectionId }: LineGroupProps) {
    const { editorState } = useDoc()

    const isHoverable = editorState.editingMode === null

    return (
        <div className={`line-group`}>
            {lineGroup.lines.map(line => (
                <div
                    key={line.id}
                    className={`line-container ${isHoverable ? 'hoverable' : ''}`}
                >
                    <Line
                        key={line.id}
                        line={line}
                        lineGroupId={lineGroup.id}
                        sectionId={sectionId}
                    />
                </div>
            ))}
        </div>
    )
}
