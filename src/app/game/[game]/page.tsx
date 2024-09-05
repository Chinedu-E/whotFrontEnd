'use client'

import WhotGameUI from "@/components/GameUi"
import WhotCard from "@/components/WhotCard"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"




export default function Page(){
    

    return (
        <div className=" bg-gradient-to-br from-indigo-500 to-purple-600">
            <WhotGameUI />
        </div>
    )
}