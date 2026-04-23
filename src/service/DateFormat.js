export const formatPromoDate = (dateString) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return "";
    }
};
