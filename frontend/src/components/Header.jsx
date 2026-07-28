import {
  GlobeAltIcon,
  MapIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

export default function Header({ tripCount = 0, upcomingCount = 0 }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-[#f7f6fb]/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 text-white shadow-[0_12px_28px_rgba(124,58,237,.28)]">
            <GlobeAltIcon className="h-6 w-6" />
            <PaperAirplaneIcon className="absolute -right-1 -top-1 h-5 w-5 -rotate-12 rounded-full bg-white p-1 text-violet-600 shadow-md" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold leading-none text-slate-900">Wanderly</p>
            <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-500">
              Travel planner
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white bg-white/80 px-3.5 py-2 shadow-sm sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-slate-600">{upcomingCount} upcoming</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-violet-600 px-3.5 py-2 text-white shadow-[0_10px_22px_rgba(124,58,237,.22)]">
            <MapIcon className="h-4 w-4" />
            <span className="text-xs font-extrabold">
              {tripCount} {tripCount === 1 ? 'trip' : 'trips'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
