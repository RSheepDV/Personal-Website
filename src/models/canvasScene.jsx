import {Canvas, useFrame} from "@react-three/fiber";
import React, {useState} from 'react'
import './canvasScene.css'
import PWScene from "./PWScene.jsx";
import {useEffect} from "react";

function AnimatedScene(){
    const psCanvas = React.useRef();
    useFrame(({clock}) => {
        if (!psCanvas.current) return;

        const t = clock.getElapsedTime();
        // Use radians-per-second values so motion remains visible and continuous.
        psCanvas.current.rotation.y = Math.sin(t * 0.1) * 0.2;
        psCanvas.current.rotation.x = Math.sin(t * 0.35) * 0.05;
    })

    return(
        <group ref={psCanvas}>
            <PWScene/>
        </group>
    );
}

function CanvasScene() {

    const [resizeFactor, setResizeFactor] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            const viewportWidth = window.innerWidth;
            const deviceDpr = window.devicePixelRatio || 1;

            // Keep DPR in a safe range so animation does not stall on narrow/high-DPR screens.
            const widthScale = Math.min(1600 / Math.max(viewportWidth, 320), 2);
            const nextDpr = Math.min(deviceDpr * widthScale, 2);
            setResizeFactor(nextDpr);
        }

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return (
        <div id="canvas-container">
            <Canvas
                dpr={resizeFactor}
                camera={ {fov: 40, near: 0.1, far: 90, position: [0, 0, 20], rotation: [10 * Math.PI/180, 0, 0] }}
            >
                {/*<ambientLight intensity={1} />*/}
                {/*<directionalLight color="white" position={[0, 0, 5]} />*/}
                <AnimatedScene/>
            </Canvas>
        </div>
    )
}

export default CanvasScene
