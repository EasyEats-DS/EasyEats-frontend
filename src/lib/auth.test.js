import { describe, it, expect } from "vitest";
import { homeRouteForRole, isDriver, parseStoredUser, ROLES } from "./auth";

describe("homeRouteForRole", () => {
  it("sends a delivery person to the driver map", () => {
    expect(homeRouteForRole(ROLES.DELIVERY_PERSON)).toBe("/driver/map");
  });

  it("sends a super admin to the superadmin dashboard", () => {
    expect(homeRouteForRole(ROLES.SUPER_ADMIN)).toBe("/superadmin/dashboard");
  });

  it("sends a restaurant owner to the admin dashboard", () => {
    expect(homeRouteForRole(ROLES.RESTAURANT_OWNER)).toBe("/admin/dashboard");
  });

  it("sends a customer to the storefront", () => {
    expect(homeRouteForRole(ROLES.CUSTOMER)).toBe("/");
  });

  it("falls back to the storefront for an unknown or missing role", () => {
    expect(homeRouteForRole("SOMETHING_ELSE")).toBe("/");
    expect(homeRouteForRole(undefined)).toBe("/");
    expect(homeRouteForRole(null)).toBe("/");
  });
});

describe("isDriver", () => {
  it("recognises a delivery person", () => {
    expect(isDriver({ role: "DELIVERY_PERSON" })).toBe(true);
  });

  it("rejects every other role", () => {
    expect(isDriver({ role: "CUSTOMER" })).toBe(false);
    expect(isDriver({ role: "RESTAURANT_OWNER" })).toBe(false);
    expect(isDriver(null)).toBe(false);
    expect(isDriver({})).toBe(false);
  });
});

describe("parseStoredUser", () => {
  it("parses a stored user", () => {
    expect(parseStoredUser('{"_id":"u1","role":"CUSTOMER"}')).toEqual({
      _id: "u1",
      role: "CUSTOMER",
    });
  });

  it("returns null for missing storage rather than throwing", () => {
    // JSON.parse(null) yields null, but JSON.parse("undefined") throws --
    // both shapes have appeared in localStorage here.
    expect(parseStoredUser(null)).toBeNull();
    expect(parseStoredUser(undefined)).toBeNull();
    expect(parseStoredUser("undefined")).toBeNull();
    expect(parseStoredUser("")).toBeNull();
  });

  it("returns null for malformed JSON rather than throwing", () => {
    expect(parseStoredUser("{not json")).toBeNull();
  });
});
