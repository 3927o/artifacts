import React, { useEffect, useState } from 'react';

export const CritiqueOverlay: React.FC = () => {
    const [tooltip, setTooltip] = useState<{
        visible: boolean;
        x: number;
        y: number;
        content: string;
        severity: string;
    }>({
        visible: false,
        x: 0,
        y: 0,
        content: '',
        severity: 'info',
    });

    useEffect(() => {
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('ai-critique-trigger')) {
                const rect = target.getBoundingClientRect();
                const critique = target.getAttribute('data-critique') || '';
                const severity = target.getAttribute('data-severity') || 'info';

                setTooltip({
                    visible: true,
                    x: rect.left,
                    y: rect.bottom + 5, // Position below the text
                    content: critique,
                    severity: severity,
                });
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('ai-critique-trigger')) {
                setTooltip((prev) => ({ ...prev, visible: false }));
            }
        };

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
        <div
            id="critique-tooltip"
            className={tooltip.visible ? 'visible' : ''}
            style={{
                top: tooltip.y,
                left: tooltip.x,
            }}
        >
            {tooltip.content}
        </div>
    );
};
