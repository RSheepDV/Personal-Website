
import { useState } from 'react'
import './App.css'
import './crtOverlay.css'
import CanvasScene from "./models/canvasScene.jsx";
import ImageCollage from "./components/ImageCollage/ImageCollage.jsx";

function LivePageContent({ titleTurn, setTitleTurn }) {
    const titleRingText = "DESIGNER * PROGRAMMER * DEVELOPER * CREATOR * GAMER * CAT LOVER * ARTIST * TECH ENTHUSIAST * ";
    const collageImages = [
        'yk.png',
        'sip.png',
        'sb.png',
        'oomw.png',
        'ddcd.png',
    ];
    const sidebarLinks = [
        { href: "#home", label: "Home" },
        { href: "#about", label: "About" },
        { href: "#projects", label: "Projects" },
        { href: "#contact", label: "Contact" },
    ];

    return (
        <div id="page-root">
            <ImageCollage images={collageImages} parallaxStrength={100}/>

            <div id="canvas-background" />
            <nav className="sidebar sidebar-visible" aria-label="Sidebar navigation">
                {sidebarLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
            </nav>
            <div id="Top"><div id="title"><div className="title-orbit">
                <div className="title-ring" aria-hidden="true">
                    <svg viewBox="0 0 400 400">
                        <defs>
                            <path id="title-ring-path" d="M 200,200 m -160,0 a 160,160 0 1,1 320,0 a 160,160 0 1,1 -320,0" />
                        </defs>
                        <text className="title-ring-text">
                            <textPath href="#title-ring-path">{titleRingText}</textPath>
                        </text>
                    </svg>
                </div>
                <div className="title-flip">
                <button type="button" className="title-flip-button" onClick={() => setTitleTurn((turn) => turn + 1)} aria-label="Flip title">
                    <div className="title-flip-inner" style={{ transform: `rotateX(${titleTurn * 180}deg)` }}>
                        <div className="title-face title-face-front"><img src="/Logo.png" alt="Logo"/></div>
                        <div className="title-face title-face-back">
                            <span className="code-token code-token-name">Daniel</span>
                            <span className="code-token code-token-alias">[Yun]</span>
                            <span className="code-token code-token-surname">Tsai</span>
                        </div>
                    </div>
                </button>
            </div></div></div></div>
        </div>
    );
}

function App() {
    const [titleTurn, setTitleTurn] = useState(0);

    return (
        <>
            <CanvasScene/>
            <LivePageContent
                titleTurn={titleTurn}
                setTitleTurn={setTitleTurn}
            />
            <div className="crt-overlay" aria-hidden="true" />
        </>
    );
}

export default App
