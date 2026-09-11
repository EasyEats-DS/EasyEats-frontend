import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Minimal storage stand-in; vitest runs in node, which has no Web Storage.
const makeStorage = () => {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    get size() {
      return store.size;
    },
  };
};

const post = vi.fn();
vi.mock("axios", () => ({ default: { post: (...args) => post(...args) } }));

let localStorageMock;
let sessionStorageMock;

beforeEach(() => {
  post.mockReset();
  post.mockResolvedValue({ data: { success: true } });
  localStorageMock = makeStorage();
  sessionStorageMock = makeStorage();
  vi.stubGlobal("localStorage", localStorageMock);
  vi.stubGlobal("sessionStorage", sessionStorageMock);
});
afterEach(() => vi.unstubAllGlobals());

/** The state a signed-in customer with a full cart has in the browser. */
const signIn = () => {
  localStorage.setItem("authToken", "jwt-abc");
  localStorage.setItem("user", JSON.stringify({ _id: "u1", role: "CUSTOMER" }));
  localStorage.setItem("cartItems", JSON.stringify([{ id: "m1" }]));
  localStorage.setItem("cartRestaurantId", "r1");
  sessionStorage.setItem("scratch", "x");
};

describe("logout", () => {
  it("revokes the token server-side, sending it as the bearer credential", async () => {
    const { logout } = await import("./auth.js");
    signIn();

    await logout();

    expect(post).toHaveBeenCalledTimes(1);
    const [url, body, config] = post.mock.calls[0];
    expect(url).toMatch(/\/auth\/logout$/);
    expect(config.headers.Authorization).toBe("Bearer jwt-abc");
  });

  it("leaves no trace of the session in the browser", async () => {
    const { logout, getCurrentUser } = await import("./auth.js");
    signIn();

    await logout();

    expect(localStorage.getItem("authToken")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(getCurrentUser()).toBeNull();
    expect(sessionStorage.size).toBe(0);
  });

  it("drops the previous user's cart so the next sign-in does not inherit it", async () => {
    const { logout } = await import("./auth.js");
    signIn();

    await logout();

    expect(localStorage.getItem("cartItems")).toBeNull();
    expect(localStorage.getItem("cartRestaurantId")).toBeNull();
  });

  it("still clears the local session when the revoke call fails", async () => {
    // Kafka down, gateway down, offline -- logout must never strand the user
    // in a signed-in UI holding a live token.
    post.mockRejectedValue(new Error("Network Error"));
    const { logout } = await import("./auth.js");
    signIn();

    await expect(logout()).resolves.toBeUndefined();

    expect(localStorage.getItem("authToken")).toBeNull();
    expect(localStorage.getItem("cartItems")).toBeNull();
  });

  it("does not call the server when there is no token to revoke", async () => {
    const { logout } = await import("./auth.js");

    await logout();

    expect(post).not.toHaveBeenCalled();
  });
});
