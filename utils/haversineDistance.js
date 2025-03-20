// haversineDistance.js
const haversineDistance = (lat1, lon1, lat2, lon2, inMeters = false) => {
  const R = 6371; // Raio da Terra em km
  const toRad = (angle) => (angle * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distância em KM
  return inMeters ? distance * 1000 : distance;
};

export default haversineDistance;
