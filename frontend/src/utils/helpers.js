export const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString('en-IN')}`;
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const truncateText = (text, maxLen = 100) => {
    if (!text || text.length <= maxLen) return text;
    return text.substring(0, maxLen) + '...';
};

export const getPropertyTypeIcon = (type) => {
    const icons = {
        Apartment: '🏢',
        Villa: '🏘️',
        Plot: '📐',
        Commercial: '🏪',
        House: '🏠',
        Penthouse: '🏙️',
    };
    return icons[type] || '🏠';
};
