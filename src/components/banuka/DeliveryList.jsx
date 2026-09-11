import React, { useState } from 'react';
import { ChevronDown, MapPin, Package, Store, User } from 'lucide-react';
import axios from 'axios';

/**
 * The driver's deliveries, and the customer's orders, as cards.
 *
 * Previously styled by a hand-written stylesheet with its own palette -- green
 * #3da015 buttons, its own badges, its own spacing -- which is why the driver
 * side read as a different product from the rest of EasyEats. It now uses the
 * same idiom as every other screen: orange primary, white rounded-2xl cards,
 * the status pills the admin dashboard uses.
 */

const BASE_URL = import.meta.env.VITE_BASE_URL;

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-700',
  assigned: 'bg-blue-100 text-blue-700',
  picked_up: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const StatusPill = ({ status }) => (
  <span
    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
      STATUS_STYLES[status] || 'bg-gray-100 text-gray-700'
    }`}
  >
    {String(status || '').replace('_', ' ')}
  </span>
);

const Row = ({ label, children }) => (
  <div className="flex items-start justify-between gap-3 text-sm">
    <span className="shrink-0 text-gray-500">{label}</span>
    <span className="min-w-0 break-words text-right font-medium text-gray-900">{children}</span>
  </div>
);

const DeliveryList = ({
  deliveries = [],
  selectedDelivery,
  onSelectDelivery,
  onStatusUpdate,
  userRole,
  onFocusDriver,
}) => {
  const [expanded, setExpanded] = useState(null);
  const [removed, setRemoved] = useState([]);

  const visible = deliveries.filter((delivery) => !removed.includes(delivery._id));

  const handleContactDriver = (delivery, event) => {
    event.stopPropagation();
    if (delivery.driverId?._id) {
      onFocusDriver?.(delivery.driverId._id);
    }
  };

  const handleRemove = async (deliveryId, event) => {
    event.stopPropagation();
    try {
      await axios.delete(`${BASE_URL}/deliveries/${deliveryId}`);
      setRemoved((previous) => [...previous, deliveryId]);
    } catch (error) {
      console.error('Error removing delivery:', error);
    }
  };

  const actionsFor = (delivery) => {
    if (userRole === 'driver') {
      if (delivery.deliveryStatus === 'assigned') {
        return (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onStatusUpdate?.(delivery._id, 'picked_up');
            }}
            className="flex-1 rounded-xl bg-[#FF7A00] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e56e00]"
          >
            Start Delivery
          </button>
        );
      }
      if (delivery.deliveryStatus === 'picked_up') {
        return (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onStatusUpdate?.(delivery._id, 'delivered');
            }}
            className="flex-1 rounded-xl bg-[#4CD964] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3cc054]"
          >
            Complete
          </button>
        );
      }
      return null;
    }

    return (
      <>
        <button
          onClick={(event) => handleContactDriver(delivery, event)}
          disabled={!delivery.driverId}
          className="flex-1 rounded-xl bg-[#FF7A00] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e56e00] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
        >
          {delivery.driverId ? 'Track Driver' : 'No Driver Yet'}
        </button>
        {delivery.deliveryStatus === 'delivered' && (
          <button
            onClick={(event) => handleRemove(delivery._id, event)}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Remove
          </button>
        )}
      </>
    );
  };

  if (visible.length === 0) {
    return (
      <div className="px-4 py-10 text-center">
        <Package className="mx-auto mb-3 h-8 w-8 text-gray-300" />
        <p className="text-sm text-gray-500">
          {userRole === 'driver' ? 'No deliveries assigned yet' : 'No orders found'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-4 pb-4">
      {visible.map((delivery) => {
        const isOpen = expanded === delivery._id;
        const isSelected = selectedDelivery?._id === delivery._id;

        return (
          <div
            key={delivery._id}
            onClick={() => onSelectDelivery?.(delivery)}
            className={`cursor-pointer rounded-2xl bg-white p-4 shadow-md transition ${
              isSelected ? 'ring-2 ring-[#FF7A00]' : 'hover:shadow-lg'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 break-all font-semibold text-gray-900">
                #{String(delivery.orderId).slice(-8)}
              </p>
              <StatusPill status={delivery.deliveryStatus} />
            </div>

            <div className="mt-3 space-y-1.5">
              <Row label={userRole === 'driver' ? 'Customer' : 'Restaurant'}>
                {userRole === 'driver'
                  ? delivery.customerId?.firstName || 'Unknown'
                  : delivery.restaurantId?.name || 'Unknown'}
              </Row>

              {delivery.totalPrice != null && (
                <Row label="Total">${Number(delivery.totalPrice).toFixed(2)}</Row>
              )}
            </div>

            {isOpen && (
              <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
                {userRole === 'driver' && (
                  <Row label="Restaurant">
                    <span className="inline-flex items-center gap-1">
                      <Store className="h-3.5 w-3.5 text-gray-400" />
                      {delivery.restaurantId?.name || 'Unknown'}
                    </span>
                  </Row>
                )}

                {delivery.dropoffLocation?.address && (
                  <Row label="Address">
                    <span className="inline-flex items-start gap-1">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                      {delivery.dropoffLocation.address}
                    </span>
                  </Row>
                )}

                {delivery.driverId && userRole === 'customer' && (
                  <Row label="Driver">
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      {delivery.driverId.firstName || 'Not assigned'}
                    </span>
                  </Row>
                )}

                {delivery.paymentMethod && <Row label="Payment">{delivery.paymentMethod}</Row>}
                <Row label="Placed">{new Date(delivery.createdAt).toLocaleString()}</Row>

                {delivery.products?.length > 0 && (
                  <div className="pt-1">
                    <p className="mb-1 text-sm text-gray-500">Items</p>
                    <ul className="space-y-1">
                      {delivery.products.map((product, index) => (
                        <li
                          key={index}
                          className="flex justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2 text-sm"
                        >
                          <span className="min-w-0 break-all text-gray-700">
                            {product.quantity} × {String(product.productId).slice(-6)}
                          </span>
                          <span className="shrink-0 font-medium text-gray-900">
                            ${Number(product.price).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setExpanded(isOpen ? null : delivery._id);
                }}
                className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Details
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {actionsFor(delivery)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeliveryList;
