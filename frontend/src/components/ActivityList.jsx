import { SparklesIcon } from '@heroicons/react/24/outline';
import ActivityCard from './ActivityCard';

function ActivitySkeleton() {
  return (
    <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 rounded-[1.35rem] border border-slate-100 bg-white p-4">
      <div className="skeleton-shimmer h-[68px] rounded-2xl" />
      <div className="space-y-3 py-1">
        <div className="skeleton-shimmer h-3 w-1/3 rounded-full" />
        <div className="skeleton-shimmer h-4 w-3/4 rounded-full" />
        <div className="skeleton-shimmer h-8 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function ActivityList({ activities, onDelete, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((item) => (
          <ActivitySkeleton key={item} />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-[1.4rem] border border-dashed border-violet-200 bg-white px-5 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-orange-100 text-violet-600">
          <SparklesIcon className="h-7 w-7" />
        </div>
        <p className="mt-4 text-sm font-extrabold text-slate-700">Your itinerary is wide open</p>
        <p className="mx-auto mt-1 max-w-xs text-xs font-medium leading-5 text-slate-400">
          Add your first activity and begin filling the trip with memorable experiences.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} onDelete={onDelete} />
      ))}
    </div>
  );
}
