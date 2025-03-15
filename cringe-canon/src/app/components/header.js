"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
    const router = useRouter();
    const [dragDistance, setDragDistance] = useState(0);

    const letters = [
        "c",
        "r",
        "i",
        "n",
        "g",
        "e",
        "-",
        "c",
        "a",
        "n",
        "o",
        "n"
    ]

    return (
        <div className="flex w-full relative">
            
            <div 
                className="flex w-fit max-w-screen-lg cursor-pointer"
                onClick={() => {
                    if (Math.abs(dragDistance) < 5) router.push("/");
                }}
            >
                {letters.map((letter, index) => (
                    <motion.h1
                        key={index}
                        className="text-4xl italic cursor-grab"
                        initial={{ color: "#00000", scaleX: 0 }}
                        animate={{ color: "#ededed", scaleX: 1 }}
                        // whileHover={{ color: "#ededed", scaleX: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {letter}
                    </motion.h1>
                ))}
            </div>

        </div>
    );
}

