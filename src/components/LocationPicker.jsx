import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Crosshair, MapPin } from "lucide-react";

import { toGeoJson, toLatLng } from "../lib/geo";

/**
 * Where the customer wants their order delivered.
 *
 * Checkout previously had a read-only text box with a hardcoded address, and
 * the order had nowhere to store a location at all -- so every delivery was
 * routed to wherever the customer's browser last reported being. A pin the
 * customer places themselves is the only thing that makes the drop-off real,
 * and the address line beside it carries what coordinates cannot: the flat
 * number, the gate code, which door to knock on.
 *
 * Emits `{ coordinates: [lng, lat], address }` -- GeoJSON order, matching how
 * every position is stored and queried on the backend.
 */

const DEFAULT_CENTER = [6.9271, 79.8612]; // Colombo, as a starting view only.

const pinIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/** Tapping the map moves the pin, which is what people try first. */
function ClickToPlace({ onPick }) {
  useMapEvents({
    click: (event) => onPick([event.latlng.lat, event.latlng.lng]),
  });
  return null;
}

/** Recentres the view when the pin moves somewhere off-screen. */
function Recenter({ position }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (position) map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
}

async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await response.json();
    return data.display_name || "";
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return "";
  }
}

export default function LocationPicker({ value, onChange, addressNote, onAddressNoteChange }) {
  const [position, setPosition] = useState(() => toLatLng(value?.coordinates) || DEFAULT_CENTER);
  const [address, setAddress] = useState(value?.address || "");
  const [locating, setLocating] = useState(false);

  // The address is looked up for the pin the customer last settled on, so a
  // drag across the map does not fire a request for every pixel.
  const lookupTimer = useRef(null);
  const emit = useRef(onChange);
  emit.current = onChange;

  const place = useCallback((latLng, { lookup = true } = {}) => {
    setPosition(latLng);
    emit.current?.({ coordinates: toGeoJson(latLng), address });

    if (!lookup) return;
    clearTimeout(lookupTimer.current);
    lookupTimer.current = setTimeout(async () => {
      const found = await reverseGeocode(latLng[0], latLng[1]);
      if (!found) return;
      setAddress(found);
      emit.current?.({ coordinates: toGeoJson(latLng), address: found });
    }, 600);
    // `address` is intentionally not a dependency: including it would rebuild
    // this callback on every keystroke and restart the lookup timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start on the customer's real location when the browser will say, since it
  // is right far more often than a default city centre.
  useEffect(() => {
    if (value?.coordinates || !("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => place([pos.coords.latitude, pos.coords.longitude]),
      (error) => console.warn("Could not read current location:", error.message)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => clearTimeout(lookupTimer.current), []);

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        place([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      (error) => {
        console.warn("Could not read current location:", error.message);
        setLocating(false);
      }
    );
  };

  const onAddressTyped = (event) => {
    const next = event.target.value;
    setAddress(next);
    emit.current?.({ coordinates: toGeoJson(position), address: next });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <MapPin className="h-4 w-4 text-orange-500" />
          Drop the pin where you want your order
        </p>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <Crosshair className="h-4 w-4" />
          {locating ? "Locating…" : "Use my location"}
        </button>
      </div>

      <div className="isolate h-56 w-full overflow-hidden rounded-xl border border-gray-200 sm:h-72">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPlace onPick={place} />
          <Recenter position={position} />
          <Marker
            position={position}
            icon={pinIcon}
            draggable
            eventHandlers={{
              dragend: (event) => {
                const { lat, lng } = event.target.getLatLng();
                place([lat, lng]);
              },
            }}
          />
        </MapContainer>
      </div>

      <input
        value={address}
        onChange={onAddressTyped}
        className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Address — flat number, building, landmark"
      />

      <input
        value={addressNote}
        onChange={(event) => onAddressNoteChange?.(event.target.value)}
        className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Drop-off note (optional) — e.g. leave at reception"
      />
    </div>
  );
}
