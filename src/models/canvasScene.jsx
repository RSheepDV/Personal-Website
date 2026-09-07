import {Canvas} from "@react-three/fiber";
import React, {useMemo, useRef, useState} from 'react'
import './canvasScene.css'
import {useEffect} from "react";
import {Html, useGLTF} from "@react-three/drei";
import * as THREE from "three";

/*
import html2canvas from "html2canvas";

const collageImageCache = new Map();

function loadCollageImage(source) {
    if (!collageImageCache.has(source)) {
        const imagePromise = new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'anonymous';
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = source;
        });
        collageImageCache.set(source, imagePromise);
    }

    return collageImageCache.get(source);
}

function drawCoverImage(context, image, width, height) {
    const scale = Math.max(width / image.width, height / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

async function drawCollage(context, width, height, captureTarget) {
    const sources = Array.from(captureTarget.querySelectorAll('#collage-track img'))
        .slice(0, 6)
        .map((image) => image.currentSrc || image.src);
    const imageResults = await Promise.allSettled(sources.map(loadCollageImage));
    const panelBounds = [
        [0, 0.18, 0, 0.06],
        [0.18, 0.36, 0.06, 0.24],
        [0.36, 0.54, 0.24, 0.42],
        [0.54, 0.72, 0.42, 0.6],
        [0.72, 0.9, 0.6, 0.78],
        [0.9, 1, 0.78, 1],
    ];

    context.save();
    context.globalAlpha = 0.12;
    context.globalCompositeOperation = 'screen';

    imageResults.forEach((result, index) => {
        if (result.status !== 'fulfilled') return;

        const image = result.value;
        const [topLeft, topRight, bottomLeft, bottomRight] = panelBounds[index];
        context.save();
        context.beginPath();
        context.moveTo(topLeft * width, 0);
        context.lineTo(topRight * width, 0);
        context.lineTo(bottomRight * width, height);
        context.lineTo(bottomLeft * width, height);
        context.closePath();
        context.clip();
        drawCoverImage(context, image, width, height);
        context.restore();
    });

    context.restore();
}

function usePageTexture(captureTargetRef) {
    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 576;

        const pageTexture = new THREE.CanvasTexture(canvas);
        pageTexture.colorSpace = THREE.SRGBColorSpace;
        pageTexture.generateMipmaps = false;
        pageTexture.minFilter = THREE.LinearFilter;
        return pageTexture;
    }, []);

    useEffect(() => {
        let cancelled = false;
        let isCapturing = false;
        let captureTimer;

        const capturePage = async () => {
            const captureTarget = captureTargetRef.current;
            if (!captureTarget || isCapturing || cancelled) return;

            isCapturing = true;

            try {
                const snapshot = await html2canvas(captureTarget, {
                    backgroundColor: null,
                    logging: false,
                    scale: 0.5,
                    useCORS: true,
                    ignoreElements: (element) => element.id === 'canvas-container',
                    onclone: (clonedDocument) => {
                        const clonedSource = clonedDocument.getElementById('page-capture-source');
                        const clonedCollage = clonedDocument.getElementById('collage-background');
                        const clonedFlip = clonedDocument.querySelector('.title-flip-inner');
                        const clonedFront = clonedDocument.querySelector('.title-face-front');
                        const clonedBack = clonedDocument.querySelector('.title-face-back');

                        if (clonedSource) {
                            clonedSource.style.opacity = '1';
                        }
                        if (clonedCollage) {
                            clonedCollage.style.display = 'none';
                        }
                        if (clonedFlip && clonedFront && clonedBack) {
                            const angle = Number.parseFloat(clonedFlip.style.transform.match(/-?\d+/)?.[0] ?? '0');
                            const showBack = Math.abs(angle / 180) % 2 === 1;
                            clonedFlip.style.transform = 'none';
                            clonedFront.style.display = showBack ? 'none' : 'flex';
                            clonedBack.style.display = showBack ? 'flex' : 'none';
                            clonedBack.style.transform = 'none';
                        }
                    },
                });

                if (cancelled) return;

                const textureCanvas = texture.image;
                const context = textureCanvas.getContext('2d');
                context.clearRect(0, 0, textureCanvas.width, textureCanvas.height);
                await drawCollage(context, textureCanvas.width, textureCanvas.height, captureTarget);
                context.drawImage(snapshot, 0, 0, textureCanvas.width, textureCanvas.height);
                texture.needsUpdate = true;
            } finally {
                isCapturing = false;
            }
        };

        const scheduleCapture = () => {
            window.clearTimeout(captureTimer);
            captureTimer = window.setTimeout(capturePage, 100);
        };

        const mutationObserver = new MutationObserver(scheduleCapture);
        const resizeObserver = new ResizeObserver(scheduleCapture);
        const captureTarget = captureTargetRef.current;

        if (captureTarget) {
            mutationObserver.observe(captureTarget, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true,
            });
            resizeObserver.observe(captureTarget);
        }

        window.addEventListener('resize', scheduleCapture);
        scheduleCapture();

        return () => {
            cancelled = true;
            window.clearTimeout(captureTimer);
            mutationObserver.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener('resize', scheduleCapture);
        };
    }, [captureTargetRef, texture]);

    return texture;
}

function useScreenInteraction(captureTargetRef) {
    return React.useCallback((event) => {
        const { uv } = event;
        const captureTarget = captureTargetRef.current;
        if (!uv || !captureTarget) return;

        event.stopPropagation();

        const sourceBounds = captureTarget.getBoundingClientRect();
        const clientX = sourceBounds.left + uv.x * sourceBounds.width;
        const clientY = sourceBounds.top + (1 - uv.y) * sourceBounds.height;
        const interactiveElement = Array.from(
            captureTarget.querySelectorAll('button, a, input, select, textarea, [role="button"]')
        ).find((element) => {
            const bounds = element.getBoundingClientRect();
            return clientX >= bounds.left && clientX <= bounds.right
                && clientY >= bounds.top && clientY <= bounds.bottom;
        });

        interactiveElement?.click();
    }, [captureTargetRef]);
}
*/

function LivePageScreen({ onPageHostReady }) {
    const hostRef = useRef(null);

    useEffect(() => {
        onPageHostReady(hostRef.current);
        return () => onPageHostReady(null);
    }, [onPageHostReady]);

    return (
        <Html
            transform
            position={[0, 1.55, -0.47]}
            rotation={[0, Math.PI, 0]}
            scale={0.6}
            distanceFactor={1}
            wrapperClass="tv-page-wrapper"
        >
            <div ref={hostRef} className="tv-page-host" />
        </Html>
    );
}

function AnimatedScene(){
    const { nodes } = useGLTF('/character.glb')

    const bodyMaterial = useMemo(
        () => new THREE.MeshStandardMaterial({
            color: '#274f64',
            roughness: 0.78,
            metalness: 0.04,
            side: THREE.DoubleSide,
        }),
        []
    )

    const headMaterial = useMemo(
        () => new THREE.MeshStandardMaterial({
            color: '#c5e5f2',
            roughness: 0.7,
            metalness: 0.02,
            side: THREE.DoubleSide,
        }),
        []
    )

    return(
        <group>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube001.geometry}
                material={bodyMaterial}
                position={[0, 1.768, 0]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube002.geometry}
                material={headMaterial}
                position={[0, 1.705, 0]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube003.geometry}
                material={headMaterial}
                position={[0, 1.705, 0]}
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
            >
                <ambientLight intensity={1.2} />
                <directionalLight color="#dff4ff" intensity={2.5} position={[5, 7, 8]} />
                <directionalLight color="#6aa5c4" intensity={0.8} position={[-5, 2, -4]} />
                <AnimatedScene/>
            </Canvas>
        </div>
    )
}

useGLTF.preload('/character.glb')

export default CanvasScene
