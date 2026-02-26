/**
 * AI-based property recommendation engine
 * Uses content-based filtering with cosine similarity
 */

// Build a feature vector for a property
const buildFeatureVector = (property) => {
    const typeMap = { Apartment: 1, Villa: 2, Plot: 3, Commercial: 4, House: 5, Penthouse: 6 };
    const statusMap = { 'For Sale': 1, 'For Rent': 2 };

    // Normalize price to 0-1 range (assuming max 100M)
    const normalizedPrice = Math.min(property.price / 100000000, 1);
    // Normalize area (assuming max 10000 sqft)
    const normalizedArea = Math.min(property.area / 10000, 1);
    // Normalize bedrooms (max 10)
    const normalizedBedrooms = Math.min((property.bedrooms || 0) / 10, 1);
    // Normalize bathrooms (max 10)
    const normalizedBathrooms = Math.min((property.bathrooms || 0) / 10, 1);

    return [
        typeMap[property.propertyType] / 6 || 0,
        statusMap[property.status] / 2 || 0,
        normalizedPrice,
        normalizedArea,
        normalizedBedrooms,
        normalizedBathrooms,
    ];
};

// Cosine similarity between two vectors
const cosineSimilarity = (a, b) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (normA * normB);
};

// Get recommendations based on user's interacted properties
const getRecommendations = (userProperties, allProperties, limit = 6) => {
    if (!userProperties.length || !allProperties.length) return [];

    // Build average feature vector from user's properties
    const userVectors = userProperties.map(buildFeatureVector);
    const avgVector = userVectors[0].map((_, i) => {
        const sum = userVectors.reduce((acc, v) => acc + v[i], 0);
        return sum / userVectors.length;
    });

    // Score all properties
    const userPropertyIds = new Set(userProperties.map((p) => p._id.toString()));
    const scored = allProperties
        .filter((p) => !userPropertyIds.has(p._id.toString()))
        .map((property) => ({
            property,
            score: cosineSimilarity(avgVector, buildFeatureVector(property)),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return scored.map((s) => s.property);
};

module.exports = { getRecommendations, buildFeatureVector, cosineSimilarity };
