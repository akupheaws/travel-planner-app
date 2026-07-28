import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const toLocalDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (value) => {
  const date = toLocalDate(value);
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getTripLength = (start, end) => {
  const startDate = toLocalDate(start);
  const endDate = toLocalDate(end);
  if (!startDate || !endDate) return '';
  return `${Math.round((endDate - startDate) / 86_400_000) + 1} days`;
};

const getDestinationImage = (destination) => {
  const seed = destination
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return `https://picsum.photos/seed/trip-${seed}/700/420`;
};

export default function TripCard({ trip, selected, onSelect, onDelete }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[1.4rem] border bg-white transition duration-300 ${
        selected
          ? 'border-violet-300 shadow-[0_16px_36px_rgba(124,58,237,.2)] ring-2 ring-violet-100'
          : 'border-slate-100 shadow-sm hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_14px_30px_rgba(30,41,59,.10)]'
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(trip)}
        className="block w-full text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
        aria-pressed={selected}
      >
        <div className="relative h-32 overflow-hidden bg-gradient-to-br from-violet-500 to-orange-400">
          <img
            src={getDestinationImage(trip.destination)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

          {selected ? (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-violet-700 shadow-lg">
              <CheckCircleIcon className="h-3.5 w-3.5" />
              Viewing
            </span>
          ) : null}

          <div className="absolute inset-x-0 bottom-0 p-3.5">
            <h3 className="truncate font-display text-xl font-semibold text-white">
              {trip.destination}
            </h3>
          </div>
        </div>

        <div className="space-y-2.5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <CalendarDaysIcon className="h-4 w-4 text-violet-400" />
            <span>{formatDate(trip.startDate)}</span>
            <span className="text-slate-300">to</span>
            <span>{formatDate(trip.endDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <ClockIcon className="h-4 w-4 text-orange-400" />
            <span>{getTripLength(trip.startDate, trip.endDate)}</span>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onDelete(trip.id)}
        className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-slate-950/30 text-white/75 opacity-0 backdrop-blur-md transition hover:bg-rose-500 hover:text-white group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-4 focus:ring-rose-200"
        aria-label={`Delete trip to ${trip.destination}`}
        title="Delete trip"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </article>
  );
}
