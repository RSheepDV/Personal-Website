
import { useEffect, useRef, useState } from 'react'
import './App.css'
import './content.css'
import CanvasScene from "./models/canvasScene.jsx";

function App() {
    const titleText = "Daniel [Yun] Tsai";
    const titleRingText = "PLACEHOLDER TEXT * PLACEHOLDER TEXT * PLACEHOLDER TEXT * PLACEHOLDER TEXT * ";

    const sidebarLinks = [
        { href: "#home", label: "Home" },
        { href: "#about", label: "About" },
        { href: "#projects", label: "Projects" },
        { href: "#contact", label: "Contact" },
    ];
    const topLinksRef = useRef(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [titleTurn, setTitleTurn] = useState(0);

    useEffect(() => {
        if (!topLinksRef.current) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowSidebar(!entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        observer.observe(topLinksRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div>
            <div id={"canvas-background"} />
            <CanvasScene/>
            <nav className={`sidebar ${showSidebar ? "sidebar-visible" : ""}`} aria-label={"Sidebar navigation"}>
                {sidebarLinks.map((link) => (
                    <a key={link.href} href={link.href}>{link.label}</a>
                ))}
            </nav>
            <div id={"Top"}>
                {/*<div className={"gradientDown"}/>*/}
                <div id={"title"}>
                    <div className={"title-orbit"}>
                        <div className={"title-ring"} aria-hidden={"true"}>
                            <svg viewBox={"0 0 400 400"}>
                                <defs>
                                    <path id={"title-ring-path"} d={"M 200,200 m -160,0 a 160,160 0 1,1 320,0 a 160,160 0 1,1 -320,0"} />
                                </defs>
                                <text className={"title-ring-text"}>
                                    <textPath href={"#title-ring-path"}>{titleRingText}</textPath>
                                </text>
                            </svg>
                        </div>
                        <div className={"title-flip"}>
                            <button
                                type={"button"}
                                className={"title-flip-button"}
                                onClick={() => setTitleTurn((prev) => prev + 1)}
                                aria-label={"Flip title"}
                            >
                                <div className={"title-flip-inner"} style={{ transform: `rotateX(${titleTurn * 180}deg)` }}>
                                    <div className={"title-face title-face-front"}>
                                        <img src={"Logo.png"} alt={"Logo"}/>
                                    </div>
                                    <div className={"title-face title-face-back"}>{titleText}</div>
                                </div>
                            </button>
                        </div>
                    </div>
                    <nav ref={topLinksRef} className={"title-links"} aria-label={"Top navigation"}>
                        {sidebarLinks.map((link) => (
                            <a key={`top-${link.href}`} href={link.href}>{link.label}</a>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default App
