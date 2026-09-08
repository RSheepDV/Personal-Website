import {Canvas} from "@react-three/fiber";
import React, {useMemo, useState} from 'react'
import './canvasScene.css'
import {useEffect} from "react";
import {useGLTF} from "@react-three/drei";
import * as THREE from "three";

function AnimatedScene(){
    const { nodes } = useGLTF('/character.glb')

    const headMaterial = useMemo(
        () => new THREE.MeshStandardMaterial({
            color: '#d6e8e6',
            roughness: 0.4,
            metalness: 0.8,
            side: THREE.FrontSide,
        }),
        []
    )

    const blackMaterial = useMemo(
        () => new THREE.MeshBasicMaterial({
            color: '#000000',
            side: THREE.FrontSide,
        }),
        []
    )

    const backgroundMaterial = useMemo(
        () => new THREE.MeshBasicMaterial({
            color: '#040e1c',
            side: THREE.FrontSide,
        }),
        []
    )

    return(
        <group
            rotation={[0, 0, 0]}
        >
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube002.geometry}
                material={headMaterial}
                position={[0, 1.705, 0]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <mesh
                geometry={nodes.Cube004.geometry}
                material={backgroundMaterial}
                position={[0, 1.705, 0]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <mesh
                geometry={nodes.Cube005.geometry}
                material={blackMaterial}
                position={[0, 1.705, -0.109711]}
                rotation={[0, Math.PI / 2, 0]}
            />
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
                camera={ {fov: 40, near: 0.1, far: 90, position: [0, 1.55, -2], rotation: [0, Math.PI, 0] }}
                onCreated={({ gl }) => {
                    gl.domElement.style.pointerEvents = 'none';
                }}
                style={{ pointerEvents: 'none' }}
            >
                <ambientLight intensity={0} />
                <directionalLight color="#dff4ff" intensity={0.5} position={[0, 1, -0.3]}/>
                <directionalLight color="#dff4ff" intensity={0.5} position={[0, -1, -0.3]}/>
                <AnimatedScene/>
            </Canvas>
        </div>
    )
}

useGLTF.preload('/character.glb')

export default CanvasScene
