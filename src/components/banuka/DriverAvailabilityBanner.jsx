import { useNavigate } from 'react-router-dom';
import { Loader2, WifiOff } from 'lucide-react';

import { useSocket } from './SocketContext';
import { getCurrentUser, isDriver } from '../../lib/auth';

/**
 * Tells a driver when they are not actually receiving work.
 *
 * A signed-in driver whose token has expired still loads the map, still sees
 * their own position, and still looks available -- but the server refuses their
 * identification, so dispatch counts them as offline and every order passes
 * them by in silence. Sessions last an hour and there is no refresh, so this is
 * a state drivers will hit in a normal shift; it has to be visible on screen
 * rather than only in a console warning.
 */
export default function DriverAvailabilityBanner() {
  const navigate = useNavigate();
  const { isConnected, identified } = useSocket();

  const user = getCurrentUser();
  if (!user || !isDriver(user)) return null;

  // Still waiting on the server's answer: say nothing rather than flash a
  // warning that resolves a moment later.
  if (identified === true) return null;
  if (identified === null && isConnected) return null;

  const sessionExpired = identified === false;

  return (
    <div className="fixed bottom-24 left-1/2 z-[1500] w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 sm:bottom-6">
      <div
        className={`flex gap-3 rounded-2xl border p-4 shadow-lg ${
          sessionExpired ? 'border-red-200 bg-white' : 'border-amber-200 bg-white'
        }`}
      >
        {sessionExpired ? (
          <WifiOff className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        ) : (
          <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-amber-600" />
        )}

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900">
            {sessionExpired ? 'You are not receiving orders' : 'Reconnecting…'}
          </p>
          <p className="mt-0.5 text-sm text-gray-600">
            {sessionExpired
              ? 'Your session expired, so new delivery requests are going to other drivers. Sign in again to go back online.'
              : 'Trying to reach the delivery server.'}
          </p>

          {sessionExpired && (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Sign in again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
