import { describe, it, expect } from "vitest";
import { resolveMenuItem, toUiMenuItem } from "./menuItems";

const ITEM = {
  _id: "item-2",
  name: "Fried Rice",
  description: "Sri lankan fried rice",
  price: 200,
  category: "Main Course",
  isAvailable: true,
  imageUrl: "https://img/rice.jpg",
};

// What the service actually returns today: the whole restaurant document.
const RESTAURANT_RESPONSE = {
  _id: "rest-1",
  name: "Crepe Runner",
  description: "A highly popular Sri Lankan fast-food chain",
  menu: [{ _id: "item-1", name: "Hopper", price: 100, isAvailable: true }, ITEM],
};

describe("resolveMenuItem", () => {
  it("takes the newly added item from a restaurant document, not the restaurant", () => {
    const resolved = resolveMenuItem(RESTAURANT_RESPONSE);

    expect(resolved.name).toBe("Fried Rice");
    expect(resolved.name).not.toBe("Crepe Runner");
    expect(resolved.price).toBe(200);
  });

  it("finds the edited item by id inside a restaurant document", () => {
    expect(resolveMenuItem(RESTAURANT_RESPONSE, "item-1").name).toBe("Hopper");
  });

  it("passes through a response that is already a menu item", () => {
    expect(resolveMenuItem(ITEM)).toEqual(ITEM);
  });

  it("returns null when there is nothing usable", () => {
    expect(resolveMenuItem(null)).toBeNull();
    expect(resolveMenuItem({ menu: [] })).toBeNull();
  });
});

describe("toUiMenuItem", () => {
  it("maps a service item onto the shape the menu grid renders", () => {
    expect(toUiMenuItem(ITEM)).toEqual({
      id: "item-2",
      name: "Fried Rice",
      description: "Sri lankan fried rice",
      price: 200,
      image: "https://img/rice.jpg",
      available: true,
    });
  });

  it("defaults a missing price to 0 rather than rendering undefined", () => {
    expect(toUiMenuItem({ _id: "x", name: "Tea" }).price).toBe(0);
  });

  it("treats a missing isAvailable as available", () => {
    expect(toUiMenuItem({ _id: "x", name: "Tea" }).available).toBe(true);
  });

  it("keeps isAvailable false as unavailable", () => {
    expect(toUiMenuItem({ _id: "x", name: "Tea", isAvailable: false }).available).toBe(false);
  });

  it("returns null for a missing item", () => {
    expect(toUiMenuItem(null)).toBeNull();
  });
});
