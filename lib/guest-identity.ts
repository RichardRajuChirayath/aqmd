"use client"

import { useEffect, useState } from "react"

const GUEST_ID_KEY = "aqmd_guest_id"
const GUEST_NAME_KEY = "aqmd_guest_name"

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

export function getGuestName(): string {
    if (typeof window === "undefined") return ""
    return localStorage.getItem(GUEST_NAME_KEY) || ""
}

export function setGuestName(name: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(GUEST_NAME_KEY, name.trim())
}

export function useGuestId(): string {
    const [guestId, setGuestId] = useState<string>("")

    useEffect(() => {
        setGuestId(getGuestId())
    }, [])

    return guestId
}

export function useGuestProfile() {
    const [guestId, setGuestIdState] = useState<string>("")
    const [guestName, setGuestNameState] = useState<string>("")

    useEffect(() => {
        setGuestIdState(getGuestId())
        setGuestNameState(getGuestName())
    }, [])

    const updateName = (name: string) => {
        setGuestName(name)
        setGuestNameState(name)
    }

    return { guestId, guestName, updateName }
}
