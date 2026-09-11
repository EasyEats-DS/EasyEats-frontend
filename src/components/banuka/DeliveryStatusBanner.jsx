import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, CheckCircle2, Loader2, PackageX, UserX } from 'lucide-react';

import { useSocket } from './SocketContext';
import { getCurrentUser, isDriver } from '../../lib/auth';

/**
 * What is happening to the customer's order, while it is happening.
 *
 * The search for a driver can take minutes and involve several refusals. Left
 * unreported it reads as the app having done nothing, so each step -- looking,
 * declined, found, on the way -- says so plainly.
 */

const PRESENTATION = {
  searching: {
    icon: Loader2,
    spin: true,
    tone: 'bg-white border-gray-200',
    accent: 'text-orange-500',
    title: 'Finding you a driver',
  },
  driver_rejected: {
    icon: UserX,
    tone: 'bg-white border-amber-200',
    accent: 'text-amber-600',
    title: 'That driver passed — looking for another',
  },
  assigned: {
    icon: Bike,
    tone: 'bg-white border-emerald-200',
    accent: 'text-emerald-600',
    title: 'Driver on the way',
  },
  picked_up: {
    icon: Bike,
    tone: 'bg-white border-emerald-200',
    accent: 'text-emerald-600',
    title: 'Your order has been picked up',
  },
  delivered: {
    icon: CheckCircle2,
    tone: 'bg-white border-emerald-200',
    accent: 'text-emerald-600',
    title: 'Delivered — enjoy!',
  },
  failed: {
    icon: PackageX,
    tone: 'bg-white border-red-200',
    accent: 'text-red-600',
    title: 'No driver available right now',
  },
};

const detailFor = (status) => {
  const driverName = [status.driver?.firstName, status.driver?.lastName]
    .filter(Boolean)
    .join(' ');

  switch (status.state) {
    case 'searching':
      return status.retrying
        ? 'No one nearby answered. Trying again in a moment.'
        : `Asking nearby drivers${status.attempt ? ` (driver ${status.attempt})` : ''}…`;
    case 'driver_rejected':
      return 'We are asking the next closest driver.';
    case 'assigned':
      return driverName ? `${driverName} accepted your order.` : 'A driver accepted your order.';
    case 'picked_up':
      return driverName ? `${driverName} is bringing it to you.` : 'On its way to you.';
    case 'delivered':
      return 'Your order has arrived.';
    case 'failed':
      return 'We could not reach a driver. Please try again shortly.';
    default:
      return null;
  }
};

export default function DeliveryStatusBanner() {
  const navigate = useNavigate();
  const { deliveryStatus } = useSocket();
  const [dismissed, setDismissed] = useState(null);

  const user = getCurrentUser();
  const showToThisUser = Boolean(user) && !isDriver(user);

  // A new order supersedes any banner the customer dismissed earlier.
  useEffect(() => {
    if (deliveryStatus?.orderId && deliveryStatus.orderId !== dismissed) {
      setDismissed(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryStatus?.orderId]);

  // Delivered is the end of the story; clear it rather than leave it pinned.
  useEffect(() => {
    if (deliveryStatus?.state !== 'delivered') return undefined;
    const timeout = setTimeout(() => setDismissed(deliveryStatus.orderId), 8000);
    return () => clearTimeout(timeout);
  }, [deliveryStatus?.state, deliveryStatus?.orderId]);

  if (!showToThisUser || !deliveryStatus) return null;
  if (deliveryStatus.orderId && deliveryStatus.orderId === dismissed) return null;

  const presentation = PRESENTATION[deliveryStatus.state];
  if (!presentation) return null;

  const Icon = presentation.icon;
  const detail = detailFor(deliveryStatus);
  const canTrack = ['assigned', 'picked_up'].includes(deliveryStatus.state);

  return (
    <div className="fixed bottom-24 left-1/2 z-[1500] w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 sm:bottom-6">
      <div className={`flex gap-3 rounded-2xl border p-4 shadow-lg ${presentation.tone}`}>
        <Icon
          className={`mt-0.5 h-5 w-5 shrink-0 ${presentation.accent} ${
            presentation.spin ? 'animate-spin' : ''
          }`}
        />

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900">{presentation.title}</p>
          {detail && <p className="mt-0.5 text-sm text-gray-600">{detail}</p>}

          {canTrack && (
            <button
              type="button"
              onClick={() => navigate('/customer/map')}
              className="mt-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Track on map
            </button>
          )}
        </div>

        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setDismissed(deliveryStatus.orderId)}
          className="h-6 w-6 shrink-0 rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
}
