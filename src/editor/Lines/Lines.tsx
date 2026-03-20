import Line from "./Line.tsx"

import "./Lines.css"
import { useDoc } from "../DocContext.tsx"

export default function Lines() {
    const { currentDoc } = useDoc()

    return (
        <div className="lines" style={{ fontSize: currentDoc.docSettings.fontSize }}>
            {currentDoc.lines.map(line => (
                <Line
                    key={line.id}
                    line={line}
                />
            ))}
        </div>
    )
}
