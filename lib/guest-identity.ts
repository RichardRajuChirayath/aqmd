"use client"

import { useEffect, useState } from "react"

const GUEST_ID_KEY = "aqmd_guest_id"

function generateGuestId(): string {
    // Generate a UUID v4
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

export function getGuestId(): string {
    if (typeof window === "undefined") return ""

    let guestId = localStorage.getItem(GUEST_ID_KEY)
    if (!guestId) {
        guestId = generateGuestId()
        localStorage.setItem(GUEST_ID_KEY, guestId)
    }
    return guestId
}

export function useGuestId(): string {
    const [guestId, setGuestId] = useState<string>("")

    useEffect(() => {
        setGuestId(getGuestId())
    }, [])

    return guestId
}
