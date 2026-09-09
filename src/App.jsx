
import { useState } from 'react'
import './App.css'
import './crtOverlay.css'
import CanvasScene from "./models/canvasScene.jsx";
import ImageCollage from "./components/ImageCollage/ImageCollage.jsx";

function LivePageContent({ titleTurn, setTitleTurn }) {
    const commentPhrases = [
        "DESIGNER",
        "PROGRAMMER",
        "DEVELOPER",
        "CREATOR",
        "GAMER",
        "CAT LOVER",
        "ARTIST",
        "TECH ENTHUSIAST",
    ];
    const commentLanes = ["14%", "24%", "36%", "48%", "61%", "73%", "86%", "30%"];
    const commentDurations = ["10s", "13s", "11s", "9s", "12s", "14s", "10s", "12s"];
    const commentDelays = ["-4s", "-15s", "-8s", "-11s", "-2s", "-19s", "-6s", "-13s"];
    return (
        <div id="page-root">
            <ImageCollage
                folder="DesignTitle"
                transitionFolder="EngineeringTitle"
                minParallaxStrength={100}
                maxParallaxStrength={200}
                columns={3}
                diagonalSlant={45}
                transitionActive={titleTurn % 2 !== 0}
            />

            <div id="canvas-background" />
            <div className="comment-stream" aria-hidden="true">
                {commentPhrases.map((phrase, index) => (
                    <span
                        className="comment-stream__text"
                        key={`${phrase}-${index}`}
                        style={{
                            '--comment-top': commentLanes[index],
                            '--comment-duration': commentDurations[index],
                            '--comment-delay': commentDelays[index],
                        }}
                    >
                        {phrase}
                    </span>
                ))}
            </div>
            <div id="Top"><div id="title"><div className="title-orbit">
                <div className="title-flip">
                <button type="button" className="title-flip-button" onClick={() => setTitleTurn((turn) => turn + 1)} aria-label="Flip title">
                    <div className="title-flip-inner" style={{ transform: `rotateX(${titleTurn * 180}deg)` }}>
                        <div className="title-face title-face-front"><img src="/Logo.png" alt="Logo"/></div>
                        <div className="title-face title-face-back">
                            <span style={{ color: '#b4634b' }}>Daniel</span>
                            <span style={{ color: '#bfbfbf' }}>[</span>
                            <span style={{ color: '#c792ea' }}>Yun</span>
                            <span style={{ color: '#bfbfbf' }}>]</span>
                            <span style={{ color: '#4f85a3' }}>Tsai</span>
                            <span className="title-cursor" aria-hidden="true">|</span>
                        </div>
                    </div>
                </button>
            </div></div>
            <button type="button" className="title-entry-button">- Click here to Enter -</button>
            </div></div>
        </div>
    );
}

function App() {
    const [titleTurn, setTitleTurn] = useState(0);

    return (
        <>
            {/*<CanvasScene titleTurn={titleTurn}/>*/}
            <LivePageContent
                titleTurn={titleTurn}
                setTitleTurn={setTitleTurn}
            />
            <div className="crt-overlay" aria-hidden="true" />
        </>
    );
}

export default App
