import React, { useCallback, useEffect, useRef, useState } from "react"
import { Refresh } from "@mui/icons-material"

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

    const offsetRef = useRef(0)
    const [offset, setOffset] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const dragging = useRef(false)
    const startX = useRef(0)
    const startOffset = useRef(0)

    const updateOffset = (val: number) => {
        offsetRef.current = val
        setOffset(val)
    }

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        dragging.current = true
        startX.current = e.clientX
        startOffset.current = offsetRef.current
        e.preventDefault()
    }, [offset])

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        dragging.current = true
        startX.current = e.touches[0].clientX
        startOffset.current = offsetRef.current
    }, [offset])

    useEffect(() => {
        updateOffset(section.splitOffset)

        const onMove = (clientX: number) => {
            if (!dragging.current || !containerRef.current) return

            const totalWidth = containerRef.current.offsetWidth
            const halfWidth = totalWidth / 2
            const delta = clientX - startX.current
            const newOffset = startOffset.current + delta
            const clamped = Math.min(
                Math.max(newOffset, -halfWidth),
                halfWidth
            )

            updateOffset(Math.round(clamped))
        }

        const onMouseMove = (e: MouseEvent) => onMove(e.clientX)
        const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX)
        const onUp = () => {
            dragging.current = false

            setCurrentDoc(prev => ({
                ...prev,
                sections: prev.sections.map(s =>
                    s.id === section.id ? {
                        ...s,
                        splitOffset: offsetRef.current
                    } : s
                )
            }))
        }

        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onUp)
        document.addEventListener("touchmove", onTouchMove)
        document.addEventListener("touchend", onUp)

        return () => {
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("mouseup", onUp)
            document.removeEventListener("touchmove", onTouchMove)
            document.removeEventListener("touchend", onUp)
        }
    }, [])

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
            style={{
                gridTemplateColumns: section.lineGroups.length === 1
                    ? '1fr'
                    : `calc(50% + ${offset}px) 4px calc(50% - ${offset}px)`
            }}
            ref={containerRef}

            onClick={() => onSectionClick(section.id)}
        >
            {section.lineGroups.map((lineGroup, i) => (
                <React.Fragment key={lineGroup.id}>
                    <LineGroup
                        key={lineGroup.id}
                        lineGroup={lineGroup}
                        sectionId={section.id}
                    />
                    {(section.lineGroups.length > 1 && i === 0) && (
                        <div
                            className="section-divider"
                            onMouseDown={onMouseDown}
                            onTouchStart={onTouchStart}
                        >
                            <div
                                className="section-divider-line"
                            />
                            <div
                                className="section-divider-detect"
                            />
                            <button
                                onClick={() => updateOffset(0)}
                            >
                                <Refresh fontSize="small" />
                            </button>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}
