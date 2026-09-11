import { describe, it, expect } from "vitest";
import {
  computeStats,
  computeWeeklySeries,
  ACTIVE_ORDER_STATUSES,
} from "./dashboardStats";

// Fixed reference point so "today" / "yesterday" are deterministic.
const NOW = new Date("2026-09-11T15:00:00");

const order = (isoDate, totalAmount, userId, status = "delivered") => ({
  _id: `id-${isoDate}-${userId}-${totalAmount}`,
  userId,
  totalAmount,
  status,
  createdAt: isoDate,
});

describe("computeStats", () => {
  it("counts only orders created today", () => {
    const orders = [
      order("2026-09-11T09:00:00", 10, "u1"),
      order("2026-09-11T12:00:00", 20, "u2"),
      order("2026-09-10T12:00:00", 99, "u3"), // yesterday
    ];

    expect(computeStats(orders, NOW).todayOrders).toBe(2);
  });

  it("sums today's revenue from totalAmount", () => {
    const orders = [
      order("2026-09-11T09:00:00", 10.5, "u1"),
      order("2026-09-11T12:00:00", 20.25, "u2"),
    ];

    expect(computeStats(orders, NOW).todayRevenue).toBe(30.75);
  });

  it("excludes cancelled orders from revenue", () => {
    const orders = [
      order("2026-09-11T09:00:00", 10, "u1"),
      order("2026-09-11T10:00:00", 500, "u2", "cancelled"),
    ];

    expect(computeStats(orders, NOW).todayRevenue).toBe(10);
  });

  it("counts each customer once across all time", () => {
    const orders = [
      order("2026-09-11T09:00:00", 10, "u1"),
      order("2026-09-11T10:00:00", 10, "u1"), // repeat customer
      order("2026-08-01T10:00:00", 10, "u2"), // old but still a customer
    ];

    expect(computeStats(orders, NOW).totalCustomers).toBe(2);
  });

  it("averages order value over all non-cancelled orders", () => {
    const orders = [
      order("2026-09-11T09:00:00", 10, "u1"),
      order("2026-09-10T09:00:00", 20, "u2"),
    ];

    expect(computeStats(orders, NOW).averageOrder).toBe(15);
  });

  it("returns zeros rather than NaN when there are no orders", () => {
    const stats = computeStats([], NOW);

    expect(stats.todayOrders).toBe(0);
    expect(stats.todayRevenue).toBe(0);
    expect(stats.totalCustomers).toBe(0);
    expect(stats.averageOrder).toBe(0);
  });

  it("reports a null delta when yesterday had no orders to compare against", () => {
    const orders = [order("2026-09-11T09:00:00", 10, "u1")];

    expect(computeStats(orders, NOW).ordersDelta).toBeNull();
  });

  it("computes a percentage delta against yesterday", () => {
    const orders = [
      order("2026-09-10T09:00:00", 10, "u1"),
      order("2026-09-10T10:00:00", 10, "u2"), // 2 orders yesterday
      order("2026-09-11T09:00:00", 10, "u3"),
      order("2026-09-11T10:00:00", 10, "u4"),
      order("2026-09-11T11:00:00", 10, "u5"), // 3 orders today => +50%
    ];

    expect(computeStats(orders, NOW).ordersDelta).toBeCloseTo(50);
  });

  it("ignores orders with an unparseable createdAt instead of throwing", () => {
    const orders = [order("2026-09-11T09:00:00", 10, "u1"), order("not-a-date", 10, "u2")];

    expect(computeStats(orders, NOW).todayOrders).toBe(1);
  });
});

describe("computeWeeklySeries", () => {
  it("returns exactly seven days ending today", () => {
    const series = computeWeeklySeries([], NOW);

    expect(series).toHaveLength(7);
    expect(series[6].name).toBe("Fri"); // 2026-09-11 is a Friday
  });

  it("buckets orders and revenue into the right day", () => {
    const orders = [
      order("2026-09-11T09:00:00", 10, "u1"),
      order("2026-09-11T10:00:00", 5, "u2"),
      order("2026-09-09T10:00:00", 7, "u3"),
    ];

    const series = computeWeeklySeries(orders, NOW);

    expect(series[6]).toMatchObject({ orders: 2, revenue: 15 });
    expect(series[4]).toMatchObject({ orders: 1, revenue: 7 });
  });

  it("yields zeroed days when there are no orders", () => {
    const series = computeWeeklySeries([], NOW);

    expect(series.every((d) => d.orders === 0 && d.revenue === 0)).toBe(true);
  });

  it("drops orders older than the seven day window", () => {
    const series = computeWeeklySeries([order("2026-01-01T10:00:00", 500, "u1")], NOW);

    expect(series.reduce((sum, d) => sum + d.revenue, 0)).toBe(0);
  });
});

describe("ACTIVE_ORDER_STATUSES", () => {
  it("treats in-flight statuses as active and excludes terminal ones", () => {
    expect(ACTIVE_ORDER_STATUSES).toContain("pending");
    expect(ACTIVE_ORDER_STATUSES).toContain("processing");
    expect(ACTIVE_ORDER_STATUSES).toContain("shipped");
    expect(ACTIVE_ORDER_STATUSES).not.toContain("delivered");
    expect(ACTIVE_ORDER_STATUSES).not.toContain("cancelled");
  });
});
