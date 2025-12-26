import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
    return (
        <div className={`relative rounded-[30px] border border-white/20 w-full max-w-[500px] bg-white/45 p-6 shadow-2xl backdrop-blur-[20px] sm:p-10 ${className}`}>
            {children}
        </div>
    );
};

export default GlassCard;
