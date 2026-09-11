import { describe, expect, it } from "vitest";
import {
  activeLeg,
  externalNavigationUrl,
  formatDuration,
  pickActiveDelivery,
} from "./navigation";

const delivery = (overrides = {}) => ({
  deliveryStatus: "assigned",
  restaurantId: { name: "Mediterranean Delight", position: { coordinates: [80.443, 6.543] } },
  dropoffLocation: { lng: 79.861, lat: 6.927, address: "12 Galle Rd" },
  ...overrides,
});

const DRIVER = [6.7, 80.1];

describe("activeLeg", () => {
  it("heads for the restaurant before the order is collected", () => {
    const leg = activeLeg(delivery(), DRIVER);

    expect(leg.phase).toBe("to-restaurant");
    expect(leg.to).toEqual([6.543, 80.443]);
    expect(leg.destinationLabel).toBe("Mediterranean Delight");
    expect(leg.nextStatus).toBe("picked_up");
    expect(leg.nextAction).toBe("Start delivery");
  });

  it("switches to the customer once the order is picked up", () => {
    const leg = activeLeg(delivery({ deliveryStatus: "picked_up" }), DRIVER);

    expect(leg.phase).toBe("to-customer");
    expect(leg.to).toEqual([6.927, 79.861]);
    expect(leg.destinationLabel).toBe("12 Galle Rd");
    expect(leg.nextStatus).toBe("delivered");
    expect(leg.nextAction).toBe("Complete delivery");
  });

  it("treats the older status vocabulary the same way", () => {
    expect(activeLeg(delivery({ deliveryStatus: "in_progress" }), DRIVER).phase).toBe("to-customer");
  });

  it("has nothing to navigate once the delivery is over", () => {
    for (const deliveryStatus of ["delivered", "completed", "cancelled"]) {
      expect(activeLeg(delivery({ deliveryStatus }), DRIVER)).toBeNull();
    }
  });

  it("starts from the driver when their position is known", () => {
    expect(activeLeg(delivery(), DRIVER).from).toEqual(DRIVER);
  });

  it("still yields a drawable leg before the driver has reported a position", () => {
    const leg = activeLeg(delivery(), null);

    expect(leg.from).not.toBeNull();
    expect(leg.to).toEqual([6.543, 80.443]);
  });

  it("falls back to the customer's stored position when no drop-off was chosen", () => {
    const leg = activeLeg(
      delivery({
        deliveryStatus: "picked_up",
        dropoffLocation: undefined,
        customerId: { position: { coordinates: [79.9, 6.8] } },
      }),
      DRIVER,
    );

    expect(leg.to).toEqual([6.8, 79.9]);
  });

  it("returns null rather than a half-formed leg when the destination is unknown", () => {
    expect(activeLeg(undefined, DRIVER)).toBeNull();
    expect(
      activeLeg({ deliveryStatus: "assigned", restaurantId: {} }, DRIVER),
    ).toBeNull();
  });
});

describe("externalNavigationUrl", () => {
  it("builds a maps deep link for the active destination", () => {
    const url = externalNavigationUrl(activeLeg(delivery(), DRIVER));

    expect(url).toContain("destination=6.543,80.443");
    expect(url).toContain("travelmode=driving");
  });

  it("is null when there is no leg", () => {
    expect(externalNavigationUrl(null)).toBeNull();
  });
});

describe("formatDuration", () => {
  it("reads in minutes below an hour and hours above", () => {
    expect(formatDuration(720)).toBe("12 min");
    expect(formatDuration(3900)).toBe("1 h 5 min");
    expect(formatDuration(7200)).toBe("2 h");
  });

  it("is null when the provider gave no estimate", () => {
    expect(formatDuration(null)).toBeNull();
    expect(formatDuration(undefined)).toBeNull();
  });
});

describe("pickActiveDelivery", () => {
  it("picks the order in progress over one already delivered", () => {
    const picked = pickActiveDelivery([
      { _id: "done", deliveryStatus: "delivered" },
      { _id: "carrying", deliveryStatus: "picked_up" },
    ]);

    expect(picked._id).toBe("carrying");
  });

  it("picks an order still to collect when nothing is in progress", () => {
    const picked = pickActiveDelivery([
      { _id: "done", deliveryStatus: "delivered" },
      { _id: "todo", deliveryStatus: "assigned" },
    ]);

    expect(picked._id).toBe("todo");
  });

  it("prefers the order being carried over one not yet collected", () => {
    const picked = pickActiveDelivery([
      { _id: "todo", deliveryStatus: "assigned" },
      { _id: "carrying", deliveryStatus: "picked_up" },
    ]);

    expect(picked._id).toBe("carrying");
  });

  it("falls back to the first entry when everything is finished", () => {
    const picked = pickActiveDelivery([
      { _id: "a", deliveryStatus: "delivered" },
      { _id: "b", deliveryStatus: "cancelled" },
    ]);

    expect(picked._id).toBe("a");
  });

  it("handles an empty or missing list", () => {
    expect(pickActiveDelivery([])).toBeNull();
    expect(pickActiveDelivery(undefined)).toBeNull();
  });
});
