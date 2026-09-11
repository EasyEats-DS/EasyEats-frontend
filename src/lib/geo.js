/**
 * Coordinate order, in one place.
 *
 * The backend stores and queries positions as GeoJSON -- [longitude, latitude]
 * -- because that is what MongoDB's 2dsphere index requires. Leaflet wants the
 * opposite, [latitude, longitude]. Passing one where the other is expected
 * produces a marker in the wrong hemisphere rather than an error, so every
 * crossing of that boundary goes through here.
 */

/** True for a usable [lng, lat] (or [lat, lng]) pair. */
export const isCoordinatePair = (coordinates) =>
  Array.isArray(coordinates) &&
  coordinates.length === 2 &&
  coordinates.every((value) => Number.isFinite(Number(value)));

/**
 * GeoJSON [lng, lat] -> Leaflet [lat, lng].
 * Returns null for anything unusable so callers can skip rendering a marker
 * rather than dropping one at [0, 0] off the coast of Africa.
 */
export const toLatLng = (coordinates) => {
  if (!isCoordinatePair(coordinates)) return null;
  const [lng, lat] = coordinates.map(Number);
  return [lat, lng];
};

/** Leaflet [lat, lng] -> GeoJSON [lng, lat]. */
export const toGeoJson = (latLng) => {
  if (!isCoordinatePair(latLng)) return null;
  const [lat, lng] = latLng.map(Number);
  return [lng, lat];
};

/** A position document's coordinates as Leaflet expects them. */
export const positionToLatLng = (position) => toLatLng(position?.coordinates);

/** Metres rendered for a human: "800 m", "4.2 km". */
export const formatDistance = (metres) => {
  if (!Number.isFinite(metres)) return null;
  return metres < 1000 ? `${Math.round(metres)} m` : `${(metres / 1000).toFixed(1)} km`;
};
