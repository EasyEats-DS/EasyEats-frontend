import { describe, expect, it } from "vitest";
import {
  formatDistance,
  isCoordinatePair,
  positionToLatLng,
  toGeoJson,
  toLatLng,
} from "./geo";

describe("isCoordinatePair", () => {
  it("accepts a numeric pair", () => {
    expect(isCoordinatePair([79.86, 6.92])).toBe(true);
    expect(isCoordinatePair(["79.86", "6.92"])).toBe(true);
  });

  it("rejects anything that is not a usable pair", () => {
    expect(isCoordinatePair(null)).toBe(false);
    expect(isCoordinatePair([79.86])).toBe(false);
    expect(isCoordinatePair([79.86, 6.92, 1])).toBe(false);
    expect(isCoordinatePair(["north", 6.92])).toBe(false);
  });
});

describe("toLatLng", () => {
  it("flips GeoJSON into Leaflet order", () => {
    expect(toLatLng([79.8612, 6.9271])).toEqual([6.9271, 79.8612]);
  });

  it("returns null rather than a marker at [0, 0]", () => {
    expect(toLatLng(undefined)).toBeNull();
    expect(toLatLng([])).toBeNull();
  });
});

describe("toGeoJson", () => {
  it("flips Leaflet order back into GeoJSON", () => {
    expect(toGeoJson([6.9271, 79.8612])).toEqual([79.8612, 6.9271]);
  });

  it("round-trips", () => {
    const geoJson = [79.8612, 6.9271];
    expect(toGeoJson(toLatLng(geoJson))).toEqual(geoJson);
  });
});

describe("positionToLatLng", () => {
  it("reads a position document", () => {
    expect(positionToLatLng({ type: "Point", coordinates: [80.6337, 7.2906] })).toEqual([
      7.2906, 80.6337,
    ]);
  });

  it("tolerates a user with no position yet", () => {
    expect(positionToLatLng(undefined)).toBeNull();
    expect(positionToLatLng({})).toBeNull();
  });
});

describe("formatDistance", () => {
  it("uses metres below a kilometre and kilometres above", () => {
    expect(formatDistance(800)).toBe("800 m");
    expect(formatDistance(4200)).toBe("4.2 km");
  });

  it("returns null when the distance is unknown", () => {
    expect(formatDistance(null)).toBeNull();
    expect(formatDistance(undefined)).toBeNull();
  });
});
