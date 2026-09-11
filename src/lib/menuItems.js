/**
 * Helpers for reading a menu item out of a restaurant-service response.
 *
 * The service's addMenuItem/updateMenuItem handlers return the entire
 * restaurant document rather than the item that was just written, so reading
 * `response.name` yields the restaurant's name. These helpers pull out the
 * real item and accept both shapes, so the UI is correct whichever the
 * deployed backend returns.
 */

const PLACEHOLDER_IMAGE = "https://source.unsplash.com/random/400x300/?food";

/**
 * @param {object} response  API response: a menu item, or a restaurant document.
 * @param {string} [menuItemId]  When given, the item to look up; otherwise the
 *   most recently added item is returned.
 */
export function resolveMenuItem(response, menuItemId) {
  if (!response || typeof response !== "object") return null;

  if (Array.isArray(response.menu)) {
    if (response.menu.length === 0) return null;
    if (menuItemId) {
      return response.menu.find((item) => String(item?._id) === String(menuItemId)) ?? null;
    }
    return response.menu[response.menu.length - 1] ?? null;
  }

  // Already a menu item.
  if (response._id || response.name) return response;
  return null;
}

/** Maps a service menu item onto the shape the menu grid renders. */
export function toUiMenuItem(item) {
  if (!item || typeof item !== "object") return null;
  return {
    id: item._id,
    name: item.name,
    description: item.description,
    price: Number(item.price) || 0,
    image: item.imageUrl || PLACEHOLDER_IMAGE,
    available: item.isAvailable !== false,
  };
}
