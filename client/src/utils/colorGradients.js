export const getColorGradient = (color) => {
    const gradients = {
        '#7a55ff': 'radial-gradient(circle at 30% 30%, #baa5ff, #7a55ff)',
        '#ff3b8a': 'radial-gradient(circle at 30% 30%, #ffbae6, #ff3b8a)',
        '#3b82f6': 'radial-gradient(circle at 30% 30%, #93c5fd, #3b82f6)',
        '#06b6d4': 'radial-gradient(circle at 30% 30%, #67e8f9, #06b6d4)',
        '#10b981': 'radial-gradient(circle at 30% 30%, #6ee7b7, #10b981)',
        '#f59e0b': 'radial-gradient(circle at 30% 30%, #fcd34d, #f59e0b)',
        '#f97316': 'radial-gradient(circle at 30% 30%, #fdba74, #f97316)',
        '#ef4444': 'radial-gradient(circle at 30% 30%, #fca5a5, #ef4444)',
        '#6366f1': 'radial-gradient(circle at 30% 30%, #a5b4fc, #6366f1)',
        '#a855f7': 'radial-gradient(circle at 30% 30%, #d8b4fe, #a855f7)',
        '#0ea5e9': 'radial-gradient(circle at 30% 30%, #7dd3fc, #0ea5e9)',
        '#059669': 'radial-gradient(circle at 30% 30%, #6ee7b7, #059669)'
    };
    
    return gradients[color] || gradients['#7a55ff'];
};

export const getColorShadow = (color) => {
    const shadows = {
        '#7a55ff': '0 10px 25px rgba(122, 85, 255, 0.4)',
        '#ff3b8a': '0 10px 25px rgba(255, 59, 138, 0.4)',
        '#3b82f6': '0 10px 25px rgba(59, 130, 246, 0.4)',
        '#06b6d4': '0 10px 25px rgba(6, 182, 212, 0.4)',
        '#10b981': '0 10px 25px rgba(16, 185, 129, 0.4)',
        '#f59e0b': '0 10px 25px rgba(245, 158, 11, 0.4)',
        '#f97316': '0 10px 25px rgba(249, 115, 22, 0.4)',
        '#ef4444': '0 10px 25px rgba(239, 68, 68, 0.4)',
        '#6366f1': '0 10px 25px rgba(99, 102, 241, 0.4)',
        '#a855f7': '0 10px 25px rgba(168, 85, 247, 0.4)',
        '#0ea5e9': '0 10px 25px rgba(14, 165, 233, 0.4)',
        '#059669': '0 10px 25px rgba(5, 150, 105, 0.4)'
    };
    
    return shadows[color] || shadows['#7a55ff'];
};