import React, { useState, useEffect } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updatePosition = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', updatePosition);
        window.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            window.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [isVisible]);

    // Don't show on mobile/touch devices
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        return null;
    }

    return (
        <>
            {/* Main Dot */}
            <div 
                className="fixed top-0 left-0 w-2 h-2 bg-black rounded-full z-[9999] pointer-events-none transition-transform duration-100 ease-out"
                style={{ 
                    transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0) scale(${isHovering ? 2 : 1})`,
                    opacity: isVisible ? 1 : 0
                }}
            />
            {/* Outer Ring (Follower) */}
            <div 
                className="fixed top-0 left-0 w-8 h-8 border border-black rounded-full z-[9998] pointer-events-none transition-all duration-300 ease-out"
                style={{ 
                    transform: `translate3d(${position.x - 16}px, ${position.y - 16}px, 0) scale(${isHovering ? 1.5 : 1})`,
                    opacity: isVisible ? 0.3 : 0,
                    backgroundColor: isHovering ? 'rgba(0,0,0,0.05)' : 'transparent'
                }}
            />
            <style dangerouslySetInnerHTML={{ __html: `
                body, a, button, input, textarea {
                    cursor: none !important;
                }
                @media (max-width: 1024px) {
                    body, a, button, input, textarea {
                        cursor: auto !important;
                    }
                }
            ` }} />
        </>
    );
};

export default CustomCursor;
