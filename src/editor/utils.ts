import { createDocument, createLine, createLineGroup, createLineSettings, createSection } from "./factories"
import type { Document } from "./types"

export const hydrateDocument = (partialDoc: Partial<Document>): Document => {
    const defaultDoc = createDocument()

    return ({
        ...defaultDoc,
        ...partialDoc,
        docSettings: {
            ...defaultDoc.docSettings,
            ...partialDoc.docSettings,
            margins: {
                ...defaultDoc.docSettings.margins,
                ...partialDoc.docSettings?.margins
            }
        },
        sections: partialDoc.sections?.map(section => ({
            ...createSection(),
            ...section,
            lineGroups: section.lineGroups.map(lineGroup => ({
                ...createLineGroup(),
                ...lineGroup,
                lines: lineGroup.lines.map(line => ({
                    ...createLine(),
                    ...line,
                    settings: {
                        ...createLineSettings(),
                        ...line.settings
                    }
                })) ?? [createLine()]
            })) ?? [createLineGroup()]
        })) ?? [createSection()]
    })
}

