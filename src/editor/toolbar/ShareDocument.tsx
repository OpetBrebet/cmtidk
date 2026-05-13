import { useEffect, useRef, useState } from "react"
import { useApi } from "../../lib/api"
import { useDoc } from "../DocContext"
import type { DocumentShare } from "../types"

import "./ShareDocument.css"
import { Clear } from "@mui/icons-material"

export default function ShareDocument() {
    const { currentDoc } = useDoc()
    const { getDocShares, newDocShare, updateDocShare, deleteDocShare } = useApi()
    const [shares, setShares] = useState<DocumentShare[]>()
    const [roleLoading, setRoleLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const onAddUserClick = () => {
        const email = inputRef.current?.value
        if (!email) return

        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email)) return

        newDocShare(currentDoc.id, email, "viewer")
            .then(fetchShares)
    }

    const fetchShares = async () => {
        const snapshot = await getDocShares(currentDoc.id)
        setShares(snapshot)
    }

    useEffect(() => {
        fetchShares()
    }, [])

    return (
        <div className="document-share-body">
            <div className="document-share-list">
                {shares?.map(share => (
                    <div key={share.id} className="document-share-item">
                        <span>{share.name}</span>
                        <select
                            className={`document-share-role ${roleLoading ? "loading" : ""}`}
                            onChange={(e) => {
                                if (e.target.value !== "viewer" && e.target.value !== "editor") return
                                setRoleLoading(true)
                                share.role = e.target.value
                                updateDocShare(currentDoc.id, share.id, e.target.value)
                                    .then(() => {
                                        setTimeout(() => {
                                            setRoleLoading(false)
                                        }, 500)
                                    })
                            }}
                            value={share.role}
                            disabled={roleLoading}
                        >
                            <option key="viewer" value="viewer">
                                Viewer
                            </option>
                            <option key="editor" value="editor">
                                Editor
                            </option>
                        </select>
                        <button
                            onClick={() => deleteDocShare(currentDoc.id, share.id)
                                .then(fetchShares)
                            }
                        >
                            <Clear />
                        </button>
                    </div>
                ))}
            </div>

            <div className="document-share-add">
                <input
                    ref={inputRef}
                    type="email"
                    placeholder="Input user email"
                />
                <button
                    onClick={onAddUserClick}
                >
                    Add User
                </button>
            </div>
        </div>
    )
}
