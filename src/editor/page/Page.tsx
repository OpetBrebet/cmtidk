import Section from "./Section.tsx"
import { useDoc } from "../DocContext.tsx"

export default function Page() {
    const { currentDoc } = useDoc()

    return (
        <div className="page" style={{
            paddingTop: `${currentDoc.docSettings.margins.top}mm`,
            paddingRight: `${currentDoc.docSettings.margins.right}mm`,
            paddingBottom: `${currentDoc.docSettings.margins.bottom}mm`,
            paddingLeft: `${currentDoc.docSettings.margins.left}mm`
        }}>
            {currentDoc.sections.map(section => (
                <Section
                    key={section.id}
                    section={section}
                />
            ))}
        </div>
    )
}
