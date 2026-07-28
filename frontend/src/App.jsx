import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import TripForm from './components/TripForm';
import TripList from './components/TripList';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import { tripsApi, activitiesApi } from './api/api';
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const toLocalDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatLongDate = (value) => {
  const date = toLocalDate(value);
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const getTripLength = (start, end) => {
  const startDate = toLocalDate(start);
  const endDate = toLocalDate(end);
  if (!startDate || !endDate) return null;

  const days = Math.round((endDate - startDate) / 86_400_000) + 1;
  return `${days} day${days === 1 ? '' : 's'}`;
};

const getDestinationImage = (destination, width = 1400, height = 720) => {
  const seed = destination
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return `https://picsum.photos/seed/travel-${seed}/${width}/${height}`;
};

const getUpcomingTrips = (trips) => {
  const today = new Date().toISOString().split('T')[0];
  return trips.filter((trip) => trip.startDate?.split('T')[0] >= today).length;
};

export default function App() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [tripFormLoading, setTripFormLoading] = useState(false);
  const [activityFormLoading, setActivityFormLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const upcomingTrips = useMemo(() => getUpcomingTrips(trips), [trips]);
  const totalActivitiesLabel = activities.length === 1 ? 'activity' : 'activities';

  const showToast = useCallback((message, tone = 'error') => {
    window.clearTimeout(toastTimer.current);
    setToast({ message, tone });
    toastTimer.current = window.setTimeout(() => setToast(null), 4500);
  }, []);

  const fetchTrips = useCallback(async () => {
    try {
      setTripsLoading(true);
      const response = await tripsApi.getAll();
      setTrips(response.data);
    } catch (error) {
      showToast(error.message);
    } finally {
      setTripsLoading(false);
    }
  }, [showToast]);

  const fetchActivities = useCallback(
    async (tripId) => {
      try {
        setActivitiesLoading(true);
        const response = await activitiesApi.getByTrip(tripId);
        setActivities(response.data);
      } catch (error) {
        showToast(error.message);
      } finally {
        setActivitiesLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    if (selectedTrip) {
      fetchActivities(selectedTrip.id);
      return;
    }

    setActivities([]);
  }, [selectedTrip, fetchActivities]);

  useEffect(
    () => () => {
      window.clearTimeout(toastTimer.current);
    },
    []
  );

  const handleAddTrip = async (formData) => {
    try {
      setTripFormLoading(true);
      const response = await tripsApi.create(formData);
      setTrips((currentTrips) => [response.data, ...currentTrips]);
      setSelectedTrip(response.data);
      showToast('Your new trip is ready to plan.', 'success');
      return true;
    } catch (error) {
      showToast(error.message);
      return false;
    } finally {
      setTripFormLoading(false);
    }
  };

  const handleDeleteTrip = async (id) => {
    const confirmed = window.confirm(
      'Delete this trip and all of its activities? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await tripsApi.remove(id);
      setTrips((currentTrips) => currentTrips.filter((trip) => trip.id !== id));
      if (selectedTrip?.id === id) setSelectedTrip(null);
      showToast('Trip removed successfully.', 'success');
    } catch (error) {
      showToast(error.message);
    }
  };

  const handleSelectTrip = (trip) => {
    setSelectedTrip((currentTrip) => (currentTrip?.id === trip.id ? null : trip));
  };

  const handleAddActivity = async (tripId, formData) => {
    try {
      setActivityFormLoading(true);
      const response = await activitiesApi.create(tripId, formData);
      setActivities((currentActivities) => [...currentActivities, response.data]);
      showToast('Activity added to your itinerary.', 'success');
      return true;
    } catch (error) {
      showToast(error.message);
      return false;
    } finally {
      setActivityFormLoading(false);
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      await activitiesApi.remove(id);
      setActivities((currentActivities) =>
        currentActivities.filter((activity) => activity.id !== id)
      );
      showToast('Activity removed.', 'success');
    } catch (error) {
      showToast(error.message);
    }
  };

  const scrollToPlanner = () => {
    document.getElementById('trip-planner')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f6fb] text-slate-900">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-44 -left-36 h-[34rem] w-[34rem] rounded-full bg-violet-300/25 blur-3xl" />
        <div className="absolute top-[28rem] -right-48 h-[31rem] w-[31rem] rounded-full bg-orange-200/35 blur-3xl" />
        <div className="absolute bottom-[-18rem] left-1/3 h-[38rem] w-[38rem] rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <Header tripCount={trips.length} upcomingCount={upcomingTrips} />

      {toast ? (
        <div
          role="status"
          className={`fixed right-4 top-20 z-50 flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-2xl backdrop-blur-xl animate-toast-in sm:right-6 ${
            toast.tone === 'success'
              ? 'border-emerald-200 bg-white/95 text-emerald-900'
              : 'border-rose-200 bg-white/95 text-rose-900'
          }`}
        >
          {toast.tone === 'success' ? (
            <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-none text-emerald-500" />
          ) : (
            <ExclamationCircleIcon className="mt-0.5 h-5 w-5 flex-none text-rose-500" />
          )}
          <p className="text-sm font-semibold leading-5">{toast.message}</p>
        </div>
      ) : null}

      <main className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 sm:px-6 sm:pt-8 lg:px-8">
        <section className="hero-card relative isolate overflow-hidden rounded-[2rem] px-6 py-8 text-white shadow-[0_30px_80px_rgba(76,29,149,0.28)] sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(255,255,255,0.23),transparent_24%),radial-gradient(circle_at_85%_15%,rgba(251,191,36,0.38),transparent_22%),radial-gradient(circle_at_80%_85%,rgba(56,189,248,0.28),transparent_25%)]" />
          <div className="absolute -right-8 top-8 h-44 w-44 rounded-full border border-white/15" />
          <div className="absolute -right-16 top-0 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute bottom-5 right-[28%] h-2 w-2 rounded-full bg-white/80 shadow-[30px_-45px_0_2px_rgba(255,255,255,.35),75px_8px_0_1px_rgba(255,255,255,.45),120px_-60px_0_2px_rgba(255,255,255,.25)]" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.35fr_.65fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.17em] backdrop-blur-md">
                <SparklesIcon className="h-4 w-4 text-amber-300" />
                Dream it. Plan it. Go.
              </div>

              <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-[4rem]">
                Your next great story starts with a destination.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-violet-50/80 sm:text-lg">
                Build beautiful itineraries, keep every activity organized, and turn travel ideas into unforgettable journeys.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToPlanner}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-violet-700 shadow-[0_14px_30px_rgba(17,24,39,.18)] transition hover:-translate-y-0.5 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-white/30"
                >
                  Plan a new trip
                  <PaperAirplaneIcon className="h-4 w-4 -rotate-12" />
                </button>
                <span className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-white/75">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_5px_rgba(110,231,183,.14)]" />
                  Your itinerary updates instantly
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm lg:mr-0">
              <div className="absolute -left-5 top-6 h-24 w-24 rounded-[2rem] bg-amber-300/30 blur-2xl" />
              <div className="relative rotate-[2deg] rounded-[2rem] border border-white/20 bg-white/15 p-4 shadow-2xl backdrop-blur-xl transition duration-500 hover:rotate-0">
                <div className="rounded-[1.5rem] bg-white p-5 text-slate-900 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-violet-500">
                        Travel snapshot
                      </p>
                      <p className="mt-1 font-display text-2xl font-semibold">Ready for takeoff</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 shadow-lg">
                      <PaperAirplaneIcon className="h-6 w-6 -rotate-12 text-white" />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-violet-50 p-4">
                      <p className="text-3xl font-extrabold text-violet-700">{trips.length}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-violet-400">
                        Total trips
                      </p>
                    </div>
                    <div className="rounded-2xl bg-orange-50 p-4">
                      <p className="text-3xl font-extrabold text-orange-500">{upcomingTrips}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-orange-400">
                        Upcoming
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3">
                    <div className="flex -space-x-2">
                      {['🌴', '🏔️', '🏛️'].map((emoji) => (
                        <span
                          key={emoji}
                          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-base"
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs font-semibold leading-5 text-slate-500">
                      One place for every stop, date, and memory.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="trip-planner"
          className="mt-7 grid scroll-mt-24 grid-cols-1 items-start gap-7 lg:grid-cols-[380px_minmax(0,1fr)]"
        >
          <aside className="space-y-5 lg:sticky lg:top-24">
            <TripForm onAdd={handleAddTrip} loading={tripFormLoading} />

            <div className="rounded-[1.75rem] border border-white/80 bg-white/75 p-4 shadow-[0_18px_50px_rgba(67,56,202,.08)] backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between px-1">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-violet-500">
                    Your journeys
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-slate-900">
                    Saved trips
                  </h2>
                </div>
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-extrabold text-violet-700">
                  {trips.length}
                </span>
              </div>

              <TripList
                trips={trips}
                selectedTrip={selectedTrip}
                onSelect={handleSelectTrip}
                onDelete={handleDeleteTrip}
                loading={tripsLoading}
              />
            </div>
          </aside>

          <div className="min-w-0">
            {!selectedTrip ? (
              <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-7 shadow-[0_25px_70px_rgba(30,41,59,.09)] backdrop-blur-xl sm:p-12">
                <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-100 via-sky-50 to-orange-100 opacity-80 blur-2xl" />
                <div className="absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-violet-300 shadow-[105px_-40px_0_2px_rgba(251,146,60,.45),330px_40px_0_1px_rgba(56,189,248,.45),530px_-50px_0_2px_rgba(167,139,250,.35)]" />

                <div className="relative z-10 flex min-h-[540px] flex-col items-center justify-center text-center">
                  <div className="relative mb-7">
                    <div className="absolute inset-0 scale-150 rounded-full bg-violet-300/25 blur-2xl" />
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-[2.2rem] bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 text-white shadow-[0_22px_45px_rgba(124,58,237,.32)] rotate-3">
                      <MapPinIcon className="h-12 w-12" />
                      <PaperAirplaneIcon className="absolute -right-3 -top-3 h-9 w-9 -rotate-12 rounded-full bg-white p-2 text-violet-600 shadow-lg" />
                    </div>
                  </div>

                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-violet-500">
                    Your itinerary canvas
                  </p>
                  <h2 className="mt-3 max-w-xl font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                    Choose a trip and start shaping the adventure.
                  </h2>
                  <p className="mt-4 max-w-lg text-base leading-7 text-slate-500">
                    Select a saved destination from the left to view its dates, activities, and travel details in one beautiful space.
                  </p>

                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {[
                      ['01', 'Pick a destination'],
                      ['02', 'Add activities'],
                      ['03', 'Enjoy the journey'],
                    ].map(([number, label]) => (
                      <div
                        key={number}
                        className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 shadow-sm"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-xs font-extrabold text-violet-700">
                          {number}
                        </span>
                        <span className="text-sm font-bold text-slate-600">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-page-in">
                <article className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_28px_80px_rgba(30,41,59,.16)]">
                  <div className="relative min-h-[330px] overflow-hidden sm:min-h-[390px]">
                    <img
                      src={getDestinationImage(selectedTrip.destination)}
                      alt={`Scenic view representing ${selectedTrip.destination}`}
                      className="absolute inset-0 h-full w-full object-cover transition duration-[1800ms] hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-slate-950/10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(251,191,36,.35),transparent_25%)]" />

                    <button
                      type="button"
                      onClick={() => setSelectedTrip(null)}
                      className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-slate-950/25 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-lg transition hover:bg-slate-950/45 focus:outline-none focus:ring-4 focus:ring-white/25"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                      All trips
                    </button>

                    <div className="absolute right-5 top-5 rounded-full border border-white/25 bg-white/15 px-3.5 py-2 text-xs font-extrabold text-white backdrop-blur-lg">
                      {activities.length} {totalActivitiesLabel}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                          <MapPinIcon className="h-3.5 w-3.5 text-amber-300" />
                          Destination
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                          <ClockIcon className="h-3.5 w-3.5 text-sky-300" />
                          {getTripLength(selectedTrip.startDate, selectedTrip.endDate)}
                        </span>
                      </div>

                      <h2 className="font-display text-4xl font-semibold leading-none text-white drop-shadow-lg sm:text-6xl">
                        {selectedTrip.destination}
                      </h2>

                      <div className="mt-5 inline-flex flex-wrap items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/25 px-4 py-3 text-sm font-semibold text-white/90 backdrop-blur-xl">
                        <CalendarDaysIcon className="h-5 w-5 text-amber-300" />
                        <span>{formatLongDate(selectedTrip.startDate)}</span>
                        <span className="text-white/40">to</span>
                        <span>{formatLongDate(selectedTrip.endDate)}</span>
                      </div>
                    </div>
                  </div>
                </article>

                <section className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_22px_60px_rgba(30,41,59,.09)] backdrop-blur-xl sm:p-7">
                  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-violet-500">
                        Journey details
                      </p>
                      <h3 className="mt-1 font-display text-3xl font-semibold text-slate-900">
                        Build your itinerary
                      </h3>
                    </div>
                    <p className="max-w-sm text-sm leading-6 text-slate-500">
                      Add the places, experiences, reservations, and moments you do not want to miss.
                    </p>
                  </div>

                  <div className="grid items-start gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
                    <ActivityForm
                      tripId={selectedTrip.id}
                      onAdd={handleAddActivity}
                      loading={activityFormLoading}
                    />

                    <div className="min-w-0 rounded-[1.6rem] bg-slate-50/80 p-4 sm:p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                            <CalendarDaysIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-slate-800">Your schedule</p>
                            <p className="text-xs font-medium text-slate-400">
                              {activities.length} planned {totalActivitiesLabel}
                            </p>
                          </div>
                        </div>
                      </div>

                      <ActivityList
                        activities={activities}
                        onDelete={handleDeleteActivity}
                        loading={activitiesLoading}
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
