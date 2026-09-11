import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Minimal localStorage stand-in; vitest runs in node, which has none.
const store = new Map();
const localStorageMock = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

beforeEach(() => {
  store.clear();
  vi.stubGlobal("localStorage", localStorageMock);
});
afterEach(() => vi.unstubAllGlobals());

const load = async () => await import("./auth.js?t=" + Math.random());

describe("getCurrentUser", () => {
  it("returns the signed-in user so pages can read _id without crashing", async () => {
    const { getCurrentUser } = await load();
    localStorage.setItem("user", JSON.stringify({ _id: "d1", role: "DELIVERY_PERSON" }));

    const user = getCurrentUser();

    expect(user._id).toBe("d1");
    expect(user.role).toBe("DELIVERY_PERSON");
  });

  it("returns null when nothing is stored, instead of throwing", async () => {
    const { getCurrentUser } = await load();
    expect(getCurrentUser()).toBeNull();
  });

  it("survives a corrupt stored user", async () => {
    const { getCurrentUser } = await load();
    localStorage.setItem("user", "{broken");
    expect(getCurrentUser()).toBeNull();
  });

  it("clearAuth removes legacy keys as well as the current ones", async () => {
    const { clearAuth } = await load();
    ["authToken", "user", "driver", "Customer", "userType"].forEach((k) =>
      localStorage.setItem(k, "x")
    );

    clearAuth();

    ["authToken", "user", "driver", "Customer", "userType"].forEach((k) =>
      expect(localStorage.getItem(k)).toBeNull()
    );
  });
});
