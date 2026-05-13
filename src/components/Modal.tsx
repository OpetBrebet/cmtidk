import { useEffect } from "react"

import "./Modal.css"

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    width?: number
    title?: string
    children: React.ReactNode
}

export function Modal({ isOpen, onClose, width = 480, title, children }: ModalProps) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [onClose])

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" style={{ width: `${width}px` }} onClick={(e) => e.stopPropagation()}>
                {title && <h2 className="modal-title">{title}</h2>}
                <hr className="modal-divider" />
                {children}
            </div>
        </div>
    )
}
