'use client'
import Link from "next/link"
import { useContext } from "react"

import { ExperienceContext } from "./expreince-button-wrapper"

export const ExperienceLink = ({ children, href }: { children: React.ReactNode; href: string, }) => {
    const { setIsChooserOpen } = useContext(ExperienceContext)
    return (
        <Link className="flex flex-col items-center text-center" href={href} onClick={() => setIsChooserOpen(true)}>
            {children}
        </Link>
    )
}