// types/qrcode.react.d.ts
declare module 'qrcode.react' {
    import { Component } from 'react';
    export interface QRCodeProps {
        value: string;
        size?: number;
        bgColor?: string;
        fgColor?: string;
        level?: 'L' | 'M' | 'Q' | 'H';
        includeMargin?: boolean;
        imageSettings?: {
            src: string;
            x: number;
            y: number;
            height: number;
            width: number;
            exp: number;
        };
    }
    export default class QRCode extends Component<QRCodeProps> {}
}