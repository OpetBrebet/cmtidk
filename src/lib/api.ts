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

    async function getDocShares(id: string) {
        return apiFetch(`/api/documents/${id}/shares`)
    }

    async function newDocShare(id: string, email: string, role: "viewer" | "editor") {
        return apiFetch(`/api/documents/${id}/shares`, {
            method: "POST",
            body: JSON.stringify({
                email: email,
                role: role
            })
        })
    }

    async function updateDocShare(docId: string, shareId: string, role: "viewer" | "editor") {
        return apiFetch(`/api/documents/${docId}/shares/${shareId}`, {
            method: "PATCH",
            body: JSON.stringify({
                role: role
            })
        })
    }

    async function deleteDocShare(docId: string, shareId: string) {
        return apiFetch(`/api/documents/${docId}/shares/${shareId}`, {
            method: "DELETE"
        })
    }

    return {
        getDocuments,
        getDocument,
        newDocument,
        updateDocument,
        deleteDocument,
        getDocShares,
        newDocShare,
        updateDocShare,
        deleteDocShare

    }
}
