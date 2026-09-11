import { useEffect, useMemo, useState } from 'react';
import { MapPin, Store, Wallet } from 'lucide-react';

import { useSocket } from './SocketContext';
import { formatDistance, toLatLng } from '../../lib/geo';
import getCityName from './hooks/getCityName';

/**
 * The offer a driver is being asked to answer, with the clock running.
 *
 * Shown over whatever page the driver is on: an offer that only appeared on the
 * map screen would be missed by a driver checking their profile, and the
 * countdown would pass the order to someone else for no reason.
 */
export default function DeliveryOfferModal() {
  const { offer, acceptOffer, rejectOffer } = useSocket();

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [pickupCity, setPickupCity] = useState('');
  const [dropoffCity, setDropoffCity] = useState('');

  const totalSeconds = useMemo(
    () => Math.max(1, Math.round((offer?.timeoutMs ?? 30000) / 1000)),
    [offer?.timeoutMs],
  );

  // The countdown is driven by the server's absolute expiry rather than a local
  // tick count, so a slow tab cannot show time the driver does not have.
  useEffect(() => {
    if (!offer?.expiresAt) return undefined;

    const tick = () => {
      const remaining = new Date(offer.expiresAt).getTime() - Date.now();
      setSecondsLeft(Math.max(0, Math.ceil(remaining / 1000)));
    };

    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [offer?.expiresAt]);

  useEffect(() => {
    if (!offer) {
      setPickupCity('');
      setDropoffCity('');
      return;
    }

    let cancelled = false;
    const resolve = async (coordinates, set) => {
      const latLng = toLatLng(coordinates);
      if (!latLng) return;
      const city = await getCityName(latLng[0], latLng[1]);
      if (!cancelled) set(city);
    };

    resolve(offer.pickup?.coordinates, setPickupCity);
    resolve(offer.dropoff?.coordinates, setDropoffCity);

    return () => {
      cancelled = true;
    };
  }, [offer]);

  if (!offer) return null;

  const customer = offer.order?.customer;
  const customerName = [customer?.firstName, customer?.lastName].filter(Boolean).join(' ');
  const distance = formatDistance(offer.distanceMeters);
  const progress = Math.min(100, (secondsLeft / totalSeconds) * 100);

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-emerald-500 px-5 py-3 text-white">
          <span className="text-sm font-semibold uppercase tracking-wide">New delivery request</span>
          <span
            className={`text-2xl font-bold tabular-nums ${
              secondsLeft <= 10 ? 'text-red-100' : ''
            }`}
          >
            {secondsLeft}s
          </span>
        </div>

        <div className="h-1 bg-emerald-100">
          <div
            className={`h-full transition-[width] duration-200 ease-linear ${
              secondsLeft <= 10 ? 'bg-red-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-4 px-5 py-5">
          {customerName && (
            <p className="text-sm text-gray-600">
              From <span className="font-semibold text-gray-900">{customerName}</span>
            </p>
          )}

          <div className="space-y-3">
            <div className="flex gap-3">
              <Store className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-gray-400">Pick up</p>
                <p className="truncate font-medium text-gray-900">{offer.pickup?.name || 'Restaurant'}</p>
                {pickupCity && <p className="truncate text-sm text-gray-500">{pickupCity}</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-gray-400">Drop off</p>
                <p className="truncate font-medium text-gray-900">
                  {dropoffCity || 'Customer address'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <Wallet className="h-4 w-4" />
              {offer.paymentMethod || 'cash'}
            </span>
            <div className="text-right">
              {distance && <p className="text-gray-500">{distance} away</p>}
              {offer.totalAmount != null && (
                <p className="font-bold text-orange-500">USD {Number(offer.totalAmount).toFixed(2)}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={rejectOffer}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={acceptOffer}
              className="flex-[2] rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600"
            >
              Accept delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
