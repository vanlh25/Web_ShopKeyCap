import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
    initialSeconds: number;
    onExpire?: () => void;
    label?: string;
    variant?: 'compact' | 'large';
    theme?: 'dark' | 'light' | 'danger';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
    initialSeconds,
    onExpire,
    label,
    variant = 'compact',
    theme = 'dark'
}) => {
    const [secondsLeft, setSecondsLeft] = useState<number>(Math.max(0, initialSeconds));

    useEffect(() => {
        setSecondsLeft(Math.max(0, initialSeconds));
    }, [initialSeconds]);

    useEffect(() => {
        if (secondsLeft <= 0) {
            onExpire?.();
            return;
        }

        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onExpire?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [secondsLeft, onExpire]);

    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    // Box style depending on theme
    const boxBg =
        theme === 'danger'
            ? 'bg-gradient-to-b from-red-600 to-red-700 text-white shadow-sm shadow-red-500/30 border border-red-500/40'
            : theme === 'light'
            ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
            : 'bg-slate-900 text-white shadow-xs';

    const colonColor =
        theme === 'danger'
            ? 'text-red-600'
            : theme === 'light'
            ? 'text-slate-700'
            : 'text-slate-900';

    if (variant === 'large') {
        return (
            <div className="flex items-center gap-2">
                {label && (
                    <div className="flex items-center gap-1.5 mr-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                        </span>
                        <span className="text-[13px] md:text-[14px] font-bold text-slate-700">{label}</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5 font-mono text-[16px] md:text-[17px] font-extrabold">
                    <span className={`${boxBg} px-2.5 py-1.5 rounded-lg leading-none tracking-wider`}>{pad(hours)}</span>
                    <span className={`${colonColor} font-black animate-pulse leading-none`}>:</span>
                    <span className={`${boxBg} px-2.5 py-1.5 rounded-lg leading-none tracking-wider`}>{pad(minutes)}</span>
                    <span className={`${colonColor} font-black animate-pulse leading-none`}>:</span>
                    <span className={`${boxBg} px-2.5 py-1.5 rounded-lg leading-none tracking-wider`}>{pad(seconds)}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="inline-flex items-center gap-1.5 text-[13px]">
            {label && (
                <div className="flex items-center gap-1 mr-0.5">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                    </span>
                    <span className="text-slate-600 font-semibold text-xs">{label}</span>
                </div>
            )}
            <div className="inline-flex items-center gap-1 font-mono font-bold">
                <span className={`${boxBg} px-1.5 py-0.5 rounded text-[12px] leading-tight tracking-wider`}>{pad(hours)}</span>
                <span className={`${colonColor} font-bold leading-none animate-pulse`}>:</span>
                <span className={`${boxBg} px-1.5 py-0.5 rounded text-[12px] leading-tight tracking-wider`}>{pad(minutes)}</span>
                <span className={`${colonColor} font-bold leading-none animate-pulse`}>:</span>
                <span className={`${boxBg} px-1.5 py-0.5 rounded text-[12px] leading-tight tracking-wider`}>{pad(seconds)}</span>
            </div>
        </div>
    );
};
