import { useState } from 'react';
import { ChevronUp, MapPin, Navigation, Store } from 'lucide-react';

import { externalNavigationUrl, formatDuration } from '../../lib/navigation';
import { formatDistance } from '../../lib/geo';

/**
 * The driver's job, over the map.
 *
 * A driver watches the map and needs one instruction and one button; the full
 * list matters only between jobs. So the current job sits in a sheet at the
 * bottom of the map, always readable without scrolling, and the list is dragged
 * up over the map only when wanted -- the shape drivers already know from every
 * other delivery app.
 *
 * Collapsed it shows just the live job. Expanded it covers most of the map with
 * the full history.
 */
export default function DriverJobSheet({
  leg,
  routeInfo,
  delivery,
  onAdvance,
  title,
  children,
}) {
  const [expanded, setExpanded] = useState(false);

  const distance = routeInfo?.distanceMeters != null ? formatDistance(routeInfo.distanceMeters) : null;
  const duration = routeInfo?.durationSeconds != null ? formatDuration(routeInfo.durationSeconds) : null;

  return (
    <div
      className={`pointer-events-auto absolute inset-x-0 bottom-0 z-[500] flex flex-col rounded-t-3xl bg-gray-50 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-[max-height] duration-300 ease-out ${
        expanded ? 'max-h-[85%]' : 'max-h-[55%]'
      }`}
    >
      {/* Grab handle: the whole strip toggles, so it works without a real drag. */}
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-label={expanded ? 'Collapse' : 'Expand'}
        className="flex w-full shrink-0 flex-col items-center gap-1 rounded-t-3xl px-4 pb-1 pt-3"
      >
        <span className="h-1.5 w-10 rounded-full bg-gray-300" />
        <ChevronUp
          className={`h-4 w-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {leg && (
        <div className="shrink-0 px-4 pb-4">
          <div className="rounded-2xl bg-white p-4 shadow-md">
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  leg.phase === 'to-restaurant'
                    ? 'bg-[#FF7A00]/10 text-[#FF7A00]'
                    : 'bg-[#4CD964]/15 text-[#2fa348]'
                }`}
              >
                {leg.phase === 'to-restaurant' ? (
                  <Store className="h-5 w-5" />
                ) : (
                  <MapPin className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  {leg.phase === 'to-restaurant' ? 'Collect from' : 'Deliver to'}
                </p>
                <p className="break-words font-semibold text-gray-900">{leg.destinationLabel}</p>

                {(distance || duration) && (
                  <p className="mt-0.5 text-sm text-gray-500">
                    {[distance, duration].filter(Boolean).join(' · ')}
                    {routeInfo?.degraded && (
                      <span className="text-amber-600"> · direct line</span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <a
                href={externalNavigationUrl(leg)}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Navigation className="h-4 w-4" />
                Navigate
              </a>
              <button
                type="button"
                onClick={() => onAdvance?.(delivery._id, leg.nextStatus)}
                className={`flex-[2] rounded-xl px-3 py-3 text-sm font-semibold text-white transition ${
                  leg.phase === 'to-restaurant'
                    ? 'bg-[#FF7A00] hover:bg-[#e56e00]'
                    : 'bg-[#4CD964] hover:bg-[#3cc054]'
                }`}
              >
                {leg.nextAction}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <h2 className="px-4 pb-2 text-sm font-semibold text-gray-500">{title}</h2>
        {children}
      </div>
    </div>
  );
}
