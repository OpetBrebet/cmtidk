import { createContext, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../components/Modal"

type ModalContent = {
    width?: number
    title?: string
    content: ReactNode
}

type ModalContextType = {
    openModal: (modal: ModalContent) => void
    closeModal: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<ModalContent | null>(null)

    const openModal = (m: ModalContent) => setModal(m)
    const closeModal = () => setModal(null)

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {modal && createPortal(
                <Modal isOpen={true} onClose={closeModal} width={modal.width} title={modal.title}>
                    {modal.content}
                </Modal>,
                document.body
            )}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const ctx = useContext(ModalContext)
    if (!ctx) throw new Error("useModal must be used inside ModalProvider")
    return ctx
}
