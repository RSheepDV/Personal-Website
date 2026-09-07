
import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import './content.css'
import CanvasScene from "./models/canvasScene.jsx";

function LivePageContent({ topLinksRef, showSidebar, titleTurn, setTitleTurn }) {
    const collageImages = [
        'photo-1501785888041-af3ef285b470',
        'photo-1491553895911-0055eca6402d',
        'photo-1517816743773-6e0fd518b4a6',
        'photo-1472214103451-9374bd1c798e',
        'photo-1549880338-65ddcdfd017b',
        'photo-1496307042754-b4aa456c4a2d',
    ];
    const sidebarLinks = [
        { href: "#home", label: "Home" },
        { href: "#about", label: "About" },
        { href: "#projects", label: "Projects" },
        { href: "#contact", label: "Contact" },
    ];

    return (
        <div id="page-root">
            <div id="collage-background" aria-hidden="true"><div id="collage-track" aria-hidden="true">
                {[...collageImages, ...collageImages].map((image, index) => (
                    <img key={`${image}-${index}`} src={`https://images.unsplash.com/${image}?w=1200&q=60&auto=format&fit=crop`} alt="" />
                ))}
            </div></div>
            <div id="canvas-background" />
            <nav className={`sidebar ${showSidebar ? "sidebar-visible" : ""}`} aria-label="Sidebar navigation">
                {sidebarLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
            </nav>
            <div id="Top"><div id="title"><div className="title-orbit"><div className="title-flip">
                <button type="button" className="title-flip-button" onClick={() => setTitleTurn((turn) => turn + 1)} aria-label="Flip title">
                    <div className="title-flip-inner" style={{ transform: `rotateX(${titleTurn * 180}deg)` }}>
                        <div className="title-face title-face-front"><img src="Logo.png" alt="Logo"/></div>
                        <div className="title-face title-face-back">Daniel [Yun] Tsai</div>
                    </div>
                </button>
            </div></div><nav ref={topLinksRef} className="title-links" aria-label="Top navigation" aria-hidden="true" /></div></div>
        </div>
    );
}

function App() {
    const titleText = "Daniel [Yun] Tsai";
    const titleRingText = "DESIGNER * PROGRAMMER * DEVELOPER * CREATOR * GAMER * CAT LOVER * ARTIST * TECH ENTHUSIAST * ";

    const sidebarLinks = [
        { href: "#home", label: "Home" },
        { href: "#about", label: "About" },
        { href: "#projects", label: "Projects" },
        { href: "#contact", label: "Contact" },
    ];
    const pageRef = useRef(null);
    const topLinksRef = useRef(null);
    const [pageHost, setPageHost] = useState(null);
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
    }, [pageHost]);

    return (
        <>
            <CanvasScene/>
            <LivePageContent
                topLinksRef={topLinksRef}
                showSidebar={showSidebar}
                titleTurn={titleTurn}
                setTitleTurn={setTitleTurn}
            />
        </>
    );

    return (
        <>
            <div id="page-capture-source" ref={pageRef}>
            <div id="collage-background" aria-hidden={"true"}>
                <div id="collage-track" aria-hidden={"true"}>
                    <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=60&auto=format&fit=crop" alt="" />
                    <img src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=60&auto=format&fit=crop" alt="" />
                    <img src="https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=1200&q=60&auto=format&fit=crop" alt="" />
                    <img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=60&auto=format&fit=crop" alt="" />
                    <img src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200&q=60&auto=format&fit=crop" alt="" />
                    <img src="https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1200&q=60&auto=format&fit=crop" alt="" />
                    <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=60&auto=format&fit=crop" alt="" />
                    <img src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=60&auto=format&fit=crop" alt="" />
                    <img src="https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=1200&q=60&auto=format&fit=crop" alt="" />
                    <img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=60&auto=format&fit=crop" alt="" />
                    <img src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200&q=60&auto=format&fit=crop" alt="" />
                    <img src="https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1200&q=60&auto=format&fit=crop" alt="" />
                </div>
            </div>
            <div id={"canvas-background"} />
            <nav className={`sidebar ${showSidebar ? "sidebar-visible" : ""}`} aria-label={"Sidebar navigation"}>
                {sidebarLinks.map((link) => (
                    <a key={link.href} href={link.href}>{link.label}</a>
                ))}
            </nav>
            <div id={"Top"}>
                {/*<div className={"gradientDown"}/>*/}
                <div id={"title"}>
                    <div className={"title-orbit"}>
                        {/*<div className={"title-ring"} aria-hidden={"true"}>*/}
                        {/*    <svg viewBox={"0 0 400 400"}>*/}
                        {/*        <defs>*/}
                        {/*            <path id={"title-ring-path"} d={"M 200,200 m -160,0 a 160,160 0 1,1 320,0 a 160,160 0 1,1 -320,0"} />*/}
                        {/*        </defs>*/}
                        {/*        <text className={"title-ring-text"}>*/}
                        {/*            <textPath href={"#title-ring-path"}>{titleRingText}</textPath>*/}
                        {/*        </text>*/}
                        {/*    </svg>*/}
                        {/*</div>*/}
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
                    <nav ref={topLinksRef} className={"title-links"} aria-label={"Top navigation"} aria-hidden={"true"}></nav>
                </div>
            </div>
            </div>
            <CanvasScene captureTargetRef={pageRef}/>
        </>
    )
}

export default App
