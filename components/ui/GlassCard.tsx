import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
    return (
        <div className={`relative overflow-hidden rounded-[30px] border border-white/20 min-w-[700px] bg-white/45 p-8 shadow-2xl backdrop-blur-[20px] sm:p-12 ${className}`}>
            {children}
        </div>
    );
};

export default GlassCard;
