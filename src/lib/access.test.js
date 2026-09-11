import { describe, it, expect } from "vitest";
import { ROLES } from "./auth";
import { canAccess, navItemsForRole, showsCart } from "./access";

describe("canAccess", () => {
  it("lets a customer into a customer-only route", () => {
    expect(canAccess(ROLES.CUSTOMER, [ROLES.CUSTOMER])).toBe(true);
  });

  it("keeps a delivery person out of the shopping routes", () => {
    expect(canAccess(ROLES.DELIVERY_PERSON, [ROLES.CUSTOMER])).toBe(false);
  });

  it("keeps a customer out of the admin dashboard", () => {
    expect(canAccess(ROLES.CUSTOMER, [ROLES.RESTAURANT_OWNER])).toBe(false);
  });

  it("keeps a restaurant owner out of the superadmin area", () => {
    expect(canAccess(ROLES.RESTAURANT_OWNER, [ROLES.SUPER_ADMIN])).toBe(false);
  });

  it("allows any signed-in role when a route names no roles", () => {
    expect(canAccess(ROLES.DELIVERY_PERSON, undefined)).toBe(true);
    expect(canAccess(ROLES.CUSTOMER, [])).toBe(true);
  });

  it("denies a user with no role when the route is restricted", () => {
    expect(canAccess(null, [ROLES.CUSTOMER])).toBe(false);
    expect(canAccess(undefined, [ROLES.CUSTOMER])).toBe(false);
  });
});

describe("navItemsForRole", () => {
  it("gives a delivery person deliveries, not shopping", () => {
    const paths = navItemsForRole(ROLES.DELIVERY_PERSON).map((i) => i.path);

    expect(paths).toContain("/driver/map");
    expect(paths).not.toContain("/restaurant");
    expect(paths).not.toContain("/payment");
    expect(paths).not.toContain("/cart");
  });

  it("gives a customer the storefront navigation", () => {
    const paths = navItemsForRole(ROLES.CUSTOMER).map((i) => i.path);

    expect(paths).toContain("/restaurant");
    expect(paths).toContain("/viewOrder");
    expect(paths).toContain("/customer/map");
  });

  it("falls back to customer navigation for an unknown role", () => {
    expect(navItemsForRole("NOPE")).toEqual(navItemsForRole(ROLES.CUSTOMER));
  });

  it("leaves Profile to the layout, which renders it for every role", () => {
    // UserLayout appends its own Profile button to both the header and the
    // bottom bar. A role that also lists Profile here gets it twice.
    for (const role of Object.values(ROLES)) {
      const paths = navItemsForRole(role).map((i) => i.path);
      expect(paths).not.toContain("/profile");
    }
  });

  it("gives every item a label and a path", () => {
    for (const role of Object.values(ROLES)) {
      for (const item of navItemsForRole(role)) {
        expect(item.label).toBeTruthy();
        expect(item.path).toMatch(/^\//);
      }
    }
  });
});

describe("showsCart", () => {
  it("hides the cart from a delivery person, who never orders", () => {
    expect(showsCart(ROLES.DELIVERY_PERSON)).toBe(false);
  });

  it("shows the cart to a customer", () => {
    expect(showsCart(ROLES.CUSTOMER)).toBe(true);
  });
});
