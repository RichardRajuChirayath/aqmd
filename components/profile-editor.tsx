"use client"

import { useState } from "react"
import { useGuestProfile } from "@/lib/guest-identity"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Edit2, Check, X } from "lucide-react"
import { toast } from "sonner"

export function ProfileEditor() {
    const { guestId, guestName, updateName } = useGuestProfile()
    const [isEditing, setIsEditing] = useState(false)
    const [tempName, setTempName] = useState("")

    const handleStartEdit = () => {
        setTempName(guestName)
        setIsEditing(true)
    }

    const handleSave = () => {
        if (tempName.trim()) {
            updateName(tempName.trim())
            toast.success("Name updated!")
        }
        setIsEditing(false)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setTempName("")
    }

    const shortId = guestId.split("-")[0].toUpperCase()

    return (
        <div className="flex items-center gap-2">
            {isEditing ? (
                <div className="flex items-center gap-1">
                    <Input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="Your name"
                        className="h-7 text-xs w-24"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave()
                            if (e.key === "Escape") handleCancel()
                        }}
                    />
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleSave}>
                        <Check className="w-3 h-3 text-emerald-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleCancel}>
                        <X className="w-3 h-3 text-red-500" />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-1.5 cursor-pointer group" onClick={handleStartEdit}>
                    <User className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                        {guestName || shortId}
                    </span>
                    <Edit2 className="w-2.5 h-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}
        </div>
    )
}
