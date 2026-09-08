import { useEffect, useRef } from 'react'
import './ImageCollage.css'

const designImageModules = import.meta.glob(
    '/public/DesignTitle/*.{png,jpg,jpeg,webp,gif}',
    { eager: true, query: '?url', import: 'default' }
);
const engineeringImageModules = import.meta.glob(
    '/public/EngineeringTitle/*.{png,jpg,jpeg,webp,gif}',
    { eager: true, query: '?url', import: 'default' }
);

function sortImageModules(imageModules) {
    return Object.entries(imageModules)
    .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath, undefined, { numeric: true }))
    .map(([, imageUrl]) => imageUrl);
}

const collageFolderImages = {
    DesignTitle: sortImageModules(designImageModules),
    EngineeringTitle: sortImageModules(engineeringImageModules)
};

function ImageCollage({
    images,
    folder = 'DesignTitle',
    transitionFolder,
    columns = 2,
    duration = 45,
    minParallaxStrength = 0,
    maxParallaxStrength = 18,
    separatorWidth = '3rem',
    diagonalSlant = 20,
    visible = true,
    transitionActive = false,
}) {
    const folderImages = collageFolderImages[folder] || collageFolderImages.DesignTitle;
    const activeImages = images || folderImages;
    const transitionImages = transitionFolder
        ? collageFolderImages[transitionFolder] || []
        : [];
    const visibleColumns = Math.max(1, columns);
    const repeatedImages = [...activeImages, ...activeImages];
    const slant = Math.max(0, Math.min(diagonalSlant, 45));
    const frameWidth = 100 + slant * 2;
    const tileRefs = useRef([]);
    const previousLefts = useRef([]);
    const imageStrengths = useRef([]);
    const collageStyle = {
        '--collage-total-tiles': repeatedImages.length,
        '--collage-track-width': `${(repeatedImages.length / visibleColumns) * 100}%`,
        '--collage-duration': `${duration}s`,
        '--collage-separator-width': separatorWidth,
        '--collage-frame-width': `${frameWidth}%`,
        '--collage-frame-offset': `${-slant}%`,
        '--collage-frame-top-left': `${(slant / frameWidth) * 100}%`,
        '--collage-frame-top-right': `${((100 + slant) / frameWidth) * 100}%`,
        '--collage-frame-bottom-right': `${(100 / frameWidth) * 100}%`,
        '--collage-diagonal-bottom': `${100 - slant}%`,
    };

    useEffect(() => {
        let frameId;

        const updateParallax = () => {
            const viewportCenter = window.innerWidth / 2;
            const halfViewportWidth = Math.max(viewportCenter, 1);
            const viewportRight = window.innerWidth;

            tileRefs.current.forEach((tile, index) => {
                if (!tile) {
                    return;
                }

                const tileRect = tile.getBoundingClientRect();
                const tileCenter = tileRect.left + tileRect.width / 2;
                const distanceFromCenter = (tileCenter - viewportCenter) / halfViewportWidth;
                const previousLeft = previousLefts.current[index];
                const isEnteringFromRight = previousLeft === undefined
                    ? tileRect.left <= viewportRight
                    : previousLeft > viewportRight && tileRect.left <= viewportRight;
                const minStrength = Math.max(0, Math.min(minParallaxStrength, maxParallaxStrength));
                const maxStrength = Math.max(minStrength, maxParallaxStrength);

                if (isEnteringFromRight && imageStrengths.current[index] === undefined) {
                    imageStrengths.current[index] = minStrength
                        + Math.random() * (maxStrength - minStrength);
                }

                tile.style.setProperty(
                    '--collage-parallax-offset',
                    `${distanceFromCenter * (imageStrengths.current[index] || 0)}px`
                );
                previousLefts.current[index] = tileRect.left;
            });

            frameId = requestAnimationFrame(updateParallax);
        };

        frameId = requestAnimationFrame(updateParallax);

        return () => cancelAnimationFrame(frameId);
    }, [minParallaxStrength, maxParallaxStrength, repeatedImages.length]);

    return (
        <div
            className={`image-collage${visible ? ' image-collage--visible' : ''}${transitionFolder && transitionActive ? ' image-collage--transitioning' : ''}`}
            style={collageStyle}
            aria-hidden="true"
        >
            <div className="image-collage__track">
                {repeatedImages.map((image, index) => {
                    const transitionImage = transitionImages.length > 0
                        ? transitionImages[index % transitionImages.length]
                        : null;

                    return (
                    <div
                        className="image-collage__tile"
                        key={`${image}-${index}`}
                        ref={(tile) => {
                            tileRefs.current[index] = tile;
                        }}
                    >
                        <div className="image-collage__frame">
                            <img className="image-collage__image image-collage__image--primary" src={image} alt="" />
                            {transitionImage && (
                                <img className="image-collage__image image-collage__image--transition" src={transitionImage} alt="" />
                            )}
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ImageCollage
