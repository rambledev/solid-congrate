// QRCodeComponent.tsx
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeComponentProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
    value,
    size = 100,
    bgColor = '#FFFFFF',
    fgColor = '#000000',
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, value, {
                width: size,
                margin: 1,
                color: {
                    dark: fgColor,
                    light: bgColor,
                },
            }).catch(err => {
                console.error(err);
            });
        }
    }, [value, size, bgColor, fgColor]);

    return (
        <canvas ref={canvasRef} width={size} height={size} />
    );
};

export default QRCodeComponent;