import type { Document as DocumentType } from "../editor/types"

async function apiFetch(path: string, options?: RequestInit) {
    const res = await fetch(path, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers
        }
    })
    return res.json()
}

export function useApi() {
    async function getDocuments() {
        return apiFetch("/api/documents")
    }

    async function getDocument(id: string) {
        return apiFetch(`/api/documents/${id}`)
    }

    async function newDocument(doc: Omit<DocumentType, "id" | "createdAt">) {
        return apiFetch("/api/documents", {
            method: "POST",
            body: JSON.stringify(doc)
        })
    }

    async function updateDocument(id: string, doc: Partial<DocumentType>) {
        return apiFetch(`/api/documents/${id}`, {
            method: "PUT",
            body: JSON.stringify(doc)
        })
    }

    async function deleteDocument(id: string) {
        return apiFetch(`/api/documents/${id}`, {
            method: "DELETE"
        })
    }

    return {
        getDocuments,
        getDocument,
        newDocument,
        updateDocument,
        deleteDocument
    }
}
