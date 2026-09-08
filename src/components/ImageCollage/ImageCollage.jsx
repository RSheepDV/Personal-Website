import { useEffect, useRef } from 'react'
import './ImageCollage.css'

function ImageCollage({
    images,
    columns = images.length,
    duration = 45,
    parallaxStrength = 18,
    separatorWidth = '3rem',
}) {
    const imageSet = Array.from(
        { length: columns },
        (_, index) => images[index % images.length]
    );
    const repeatedImages = [...imageSet, ...imageSet];
    const tileRefs = useRef([]);
    const previousLefts = useRef([]);
    const imageStrengths = useRef([]);
    const collageStyle = {
        '--collage-columns': columns,
        '--collage-total-tiles': repeatedImages.length,
        '--collage-duration': `${duration}s`,
        '--collage-separator-width': separatorWidth,
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

                if (isEnteringFromRight && imageStrengths.current[index] === undefined) {
                    imageStrengths.current[index] = Math.random() * Math.max(parallaxStrength, 0);
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
    }, [columns, parallaxStrength, repeatedImages.length]);

    return (
        <div className="image-collage" style={collageStyle} aria-hidden="true">
            <div className="image-collage__track">
                {repeatedImages.map((image, index) => (
                    <div
                        className="image-collage__tile"
                        key={`${image}-${index}`}
                        ref={(tile) => {
                            tileRefs.current[index] = tile;
                        }}
                    >
                        <div className="image-collage__frame">
                            <img src={`/DesignTitle/${image}`} alt="" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ImageCollage
