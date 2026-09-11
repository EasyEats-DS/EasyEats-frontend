/**
 * Pure helpers that turn a list of orders into the numbers the admin
 * dashboards display. Kept free of React and network calls so the date and
 * divide-by-zero handling can be unit tested.
 */

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_MS = 24 * 60 * 60 * 1000;

/** Order statuses that count as still in flight. */
export const ACTIVE_ORDER_STATUSES = ["pending", "processing", "shipped"];

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Returns a Date, or null when the value isn't a usable date. */
const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isCancelled = (order) =>
  String(order?.status ?? "").toLowerCase() === "cancelled";

const amountOf = (order) => {
  const amount = Number(order?.totalAmount);
  return Number.isFinite(amount) ? amount : 0;
};

const round2 = (value) => Math.round(value * 100) / 100;

/** Percentage change, or null when there is no baseline to compare against. */
const percentChange = (current, previous) =>
  previous > 0 ? round2(((current - previous) / previous) * 100) : null;

/**
 * Headline figures for a set of orders.
 * `now` is injectable so tests aren't tied to the wall clock.
 */
export function computeStats(orders, now = new Date()) {
  const list = Array.isArray(orders) ? orders : [];
  const todayStart = startOfDay(now).getTime();
  const yesterdayStart = todayStart - DAY_MS;

  let todayOrders = 0;
  let todayRevenue = 0;
  let yesterdayOrders = 0;
  let yesterdayRevenue = 0;
  let countedOrders = 0;
  let totalRevenue = 0;
  const customers = new Set();

  for (const order of list) {
    if (order?.userId) customers.add(String(order.userId));

    const cancelled = isCancelled(order);
    const amount = amountOf(order);

    if (!cancelled) {
      countedOrders += 1;
      totalRevenue += amount;
    }

    const createdAt = parseDate(order?.createdAt);
    if (!createdAt) continue;
    const time = createdAt.getTime();

    if (time >= todayStart) {
      todayOrders += 1;
      if (!cancelled) todayRevenue += amount;
    } else if (time >= yesterdayStart) {
      yesterdayOrders += 1;
      if (!cancelled) yesterdayRevenue += amount;
    }
  }

  return {
    todayOrders,
    todayRevenue: round2(todayRevenue),
    totalCustomers: customers.size,
    averageOrder: countedOrders > 0 ? round2(totalRevenue / countedOrders) : 0,
    ordersDelta: percentChange(todayOrders, yesterdayOrders),
    revenueDelta: percentChange(todayRevenue, yesterdayRevenue),
  };
}

/**
 * Seven day-buckets ending on `now`, shaped for the Recharts area charts.
 */
export function computeWeeklySeries(orders, now = new Date()) {
  const list = Array.isArray(orders) ? orders : [];
  const todayStart = startOfDay(now);

  const days = [];
  const indexByTime = new Map();

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(todayStart.getTime() - offset * DAY_MS);
    indexByTime.set(date.getTime(), days.length);
    days.push({ name: DAY_NAMES[date.getDay()], orders: 0, revenue: 0 });
  }

  for (const order of list) {
    const createdAt = parseDate(order?.createdAt);
    if (!createdAt) continue;

    const index = indexByTime.get(startOfDay(createdAt).getTime());
    if (index === undefined) continue;

    days[index].orders += 1;
    if (!isCancelled(order)) days[index].revenue += amountOf(order);
  }

  return days.map((day) => ({ ...day, revenue: round2(day.revenue) }));
}
