/**
 * WEATHER SHOP DATA
 * All weather types available for purchase. Buying auto-summons the weather.
 * Players can buy weather up to 5 times total.
 */

const WEATHER_SHOP = Object.entries(WEATHER_DATA).map(([key, data]) => ({
    weatherKey: key,
    cost: Math.round((1 / (data.probability || 0.1)) * 50) // rarer = more expensive
}));

// Max total weather purchases per game session
const WEATHER_BUY_LIMIT = 5;

deepFreeze(WEATHER_SHOP);
