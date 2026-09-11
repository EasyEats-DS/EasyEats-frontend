/**
 * Which way the driver is currently headed.
 *
 * A delivery is two journeys, not one: to the restaurant to collect, then to
 * the customer to hand over. Which leg is live follows the delivery's status,
 * so the map never has to be told separately and cannot disagree with it.
 */

import { positionToLatLng, toLatLng } from "./geo";

/** Delivery statuses in both vocabularies that mean "collected". */
const COLLECTED = ["picked_up", "in_progress"];
const FINISHED = ["delivered", "completed", "cancelled"];

/**
 * The active leg for a delivery, or null when there is nothing to navigate.
 *
 * Returns the endpoints in Leaflet order, plus the label and the action that
 * advances the delivery, so the UI has one object to render rather than a
 * scatter of conditionals.
 */
export function activeLeg(delivery, driverPosition) {
  if (!delivery) return null;

  const status = delivery.deliveryStatus;
  if (FINISHED.includes(status)) return null;

  const restaurant =
    positionToLatLng(delivery.restaurantId?.position) ||
    toLatLng([delivery.pickupLocation?.lng, delivery.pickupLocation?.lat]);

  const customer =
    toLatLng([delivery.dropoffLocation?.lng, delivery.dropoffLocation?.lat]) ||
    positionToLatLng(delivery.customerId?.position);

  const collected = COLLECTED.includes(status);

  const destination = collected ? customer : restaurant;
  if (!destination) return null;

  return {
    phase: collected ? "to-customer" : "to-restaurant",
    label: collected ? "Navigate to customer" : "Navigate to restaurant",
    // Falls back to the other endpoint so a route can still be drawn before the
    // driver's own position has been reported.
    from: driverPosition || (collected ? restaurant : customer) || destination,
    to: destination,
    destinationLabel: collected
      ? delivery.dropoffLocation?.address || "Customer address"
      : delivery.restaurantId?.name || "Restaurant",
    nextStatus: collected ? "delivered" : "picked_up",
    nextAction: collected ? "Complete delivery" : "Start delivery",
  };
}

/**
 * The delivery the driver should be looking at.
 *
 * The list is whatever the API returned, newest last, so taking the first entry
 * selected a finished delivery whenever one happened to sort first -- and a
 * finished delivery has no leg, so the navigation panel silently vanished while
 * the driver still had an order to collect. Work in progress wins; a completed
 * delivery is only selected when there is nothing left to do.
 */
const WORK_ORDER = ['picked_up', 'in_progress', 'assigned', 'pending'];

export function pickActiveDelivery(deliveries = []) {
  if (!Array.isArray(deliveries) || deliveries.length === 0) return null;

  for (const status of WORK_ORDER) {
    const match = deliveries.find((delivery) => delivery?.deliveryStatus === status);
    if (match) return match;
  }

  return deliveries[0];
}

/** A deep link that opens the leg in whatever maps app the device has. */
export function externalNavigationUrl(leg) {
  if (!leg?.to) return null;
  const [lat, lng] = leg.to;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

/** "12 min", "1 h 5 min", or null when the provider gave no estimate. */
export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return null;

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}
