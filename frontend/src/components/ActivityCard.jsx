import { CalendarDaysIcon, TrashIcon } from '@heroicons/react/24/outline';

const toLocalDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day);
};

const getDateParts = (value) => {
  const date = toLocalDate(value);
  if (!date) return { day: '', month: '', weekday: '' };

  return {
    day: date.toLocaleDateString('en-US', { day: '2-digit' }),
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
  };
};

const ACTIVITY_TYPES = [
  {
    pattern: /eat|food|restaurant|cafe|dine|dinner|lunch|breakfast|bistro|taste|cuisine|sushi|ramen|pizza|taco/,
    emoji: '🍽️',
    label: 'Food',
    style: 'bg-orange-50 text-orange-700 ring-orange-100',
  },
  {
    pattern: /museum|art|gallery|culture|history|temple|church|monument|palace|castle|heritage|ruins|shrine/,
    emoji: '🏛️',
    label: 'Culture',
    style: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100',
  },
  {
    pattern: /hike|trek|walk|nature|park|beach|mountain|outdoor|swim|surf|dive|snorkel|camp|trail|jungle|forest/,
    emoji: '🏔️',
    label: 'Outdoor',
    style: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  },
  {
    pattern: /hotel|stay|check.in|check.out|accommodation|hostel|resort|airbnb|lodge/,
    emoji: '🏨',
    label: 'Stay',
    style: 'bg-sky-50 text-sky-700 ring-sky-100',
  },
  {
    pattern: /shop|market|buy|mall|souvenir|store|boutique|bazaar|flea|vendor/,
    emoji: '🛍️',
    label: 'Shopping',
    style: 'bg-pink-50 text-pink-700 ring-pink-100',
  },
  {
    pattern: /flight|train|bus|transport|airport|taxi|metro|subway|ferry|cruise|transfer/,
    emoji: '✈️',
    label: 'Transport',
    style: 'bg-blue-50 text-blue-700 ring-blue-100',
  },
  {
    pattern: /show|concert|theatre|theater|event|festival|night|bar|club|performance|tour|safari/,
    emoji: '🎭',
    label: 'Experience',
    style: 'bg-amber-50 text-amber-700 ring-amber-100',
  },
];

const getActivityType = (title) => {
  const normalizedTitle = title.toLowerCase();
  return (
    ACTIVITY_TYPES.find(({ pattern }) => pattern.test(normalizedTitle)) || {
      emoji: '📍',
      label: 'Activity',
      style: 'bg-violet-50 text-violet-700 ring-violet-100',
    }
  );
};

export default function ActivityCard({ activity, onDelete }) {
  const date = getDateParts(activity.activityDate);
  const type = getActivityType(activity.title);

  return (
    <article className="group relative grid grid-cols-[64px_minmax(0,1fr)] gap-3 rounded-[1.35rem] border border-slate-100 bg-white p-3.5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_14px_30px_rgba(30,41,59,.08)] sm:gap-4 sm:p-4">
      <div className="flex h-[68px] flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-lg">
        <span className="text-[10px] font-extrabold tracking-[0.12em] text-violet-200">{date.month}</span>
        <span className="font-display text-2xl font-semibold leading-none">{date.day}</span>
      </div>

      <div className="min-w-0 pr-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold ring-1 ${type.style}`}>
            <span>{type.emoji}</span>
            {type.label}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
            <CalendarDaysIcon className="h-3.5 w-3.5" />
            {date.weekday}
          </span>
        </div>

        <h4 className="mt-2 text-sm font-extrabold leading-5 text-slate-800 sm:text-base">
          {activity.title}
        </h4>

        {activity.notes ? (
          <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium leading-5 text-slate-500">
            {activity.notes}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onDelete(activity.id)}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 opacity-0 transition hover:bg-rose-100 hover:text-rose-600 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-4 focus:ring-rose-100"
        aria-label={`Delete ${activity.title}`}
        title="Delete activity"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </article>
  );
}
