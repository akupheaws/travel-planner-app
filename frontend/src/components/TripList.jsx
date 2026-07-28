import { MapIcon } from '@heroicons/react/24/outline';
import TripCard from './TripCard';

function TripSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-slate-100 bg-white">
      <div className="skeleton-shimmer h-32" />
      <div className="space-y-3 p-4">
        <div className="skeleton-shimmer h-3 w-3/4 rounded-full" />
        <div className="skeleton-shimmer h-3 w-1/2 rounded-full" />
      </div>
    </div>
  );
}

export default function TripList({ trips, selectedTrip, onSelect, onDelete, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <TripSkeleton key={item} />
        ))}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="rounded-[1.4rem] border border-dashed border-violet-200 bg-violet-50/70 px-5 py-9 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-500 shadow-sm">
          <MapIcon className="h-6 w-6" />
        </div>
        <p className="mt-3 text-sm font-extrabold text-slate-700">No trips yet</p>
        <p className="mt-1 text-xs font-medium leading-5 text-slate-400">
          Create your first destination above and begin building the itinerary.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[780px] space-y-3 overflow-y-auto pr-1 custom-scrollbar">
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          selected={selectedTrip?.id === trip.id}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
