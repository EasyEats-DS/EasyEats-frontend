import { ROLES } from "./auth";

/**
 * Who may enter a route, and what each role sees in the shared navigation.
 *
 * A delivery person never orders food, so the storefront - restaurants, menus,
 * cart, checkout - is not just hidden from them but closed to them.
 */

/**
 * @param {string|null} role  The signed-in user's role.
 * @param {string[]} [allowedRoles]  Roles the route admits. Omitted or empty
 *   means "any signed-in user".
 */
export function canAccess(role, allowedRoles) {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!role) return false;
  return allowedRoles.includes(role);
}

/** Routes only a paying customer should reach. */
export const CUSTOMER_ONLY = [ROLES.CUSTOMER];
export const OWNER_ONLY = [ROLES.RESTAURANT_OWNER];
export const SUPER_ADMIN_ONLY = [ROLES.SUPER_ADMIN];
export const DRIVER_ONLY = [ROLES.DELIVERY_PERSON];

const CUSTOMER_NAV = [
  { label: "Home", path: "/", icon: "home" },
  { label: "Restaurants", path: "/restaurant", icon: "store" },
  { label: "Orders", path: "/viewOrder", icon: "orders" },
  { label: "Payments", path: "/payment", icon: "payments" },
  { label: "Map", path: "/customer/map", icon: "map" },
];

/**
 * Profile is deliberately absent here, as it is from CUSTOMER_NAV: UserLayout
 * renders its own Profile button in both the header and the bottom bar for
 * every role, so listing it again shows it twice.
 */
const DRIVER_NAV = [
  { label: "Deliveries", path: "/driver/map", icon: "deliveries" },
];

const NAV_BY_ROLE = {
  [ROLES.CUSTOMER]: CUSTOMER_NAV,
  [ROLES.DELIVERY_PERSON]: DRIVER_NAV,
};

/** Navigation entries for a role; unknown roles get the storefront. */
export const navItemsForRole = (role) => NAV_BY_ROLE[role] ?? CUSTOMER_NAV;

/** Only roles that actually buy food get a cart and product search. */
export const showsCart = (role) => role !== ROLES.DELIVERY_PERSON;
