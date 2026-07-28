import { useState } from 'react';
import {
  CalendarDaysIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const EMPTY_FORM = { destination: '', startDate: '', endDate: '' };

export default function TripForm({ onAdd, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.destination.trim()) return setError('Enter a destination.');
    if (!form.startDate) return setError('Select a start date.');
    if (!form.endDate) return setError('Select an end date.');
    if (form.startDate > form.endDate) {
      return setError('The end date must come after the start date.');
    }

    const created = await onAdd(form);
    if (created) setForm(EMPTY_FORM);
  };

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-[0_22px_60px_rgba(76,29,149,.11)]">
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 px-5 py-5 text-white">
        <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full border border-white/20" />
        <div className="absolute -right-2 top-5 h-20 w-20 rounded-full bg-amber-300/30 blur-xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70">
              New adventure
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold">Where to next?</h2>
            <p className="mt-1 text-xs font-medium text-white/75">
              Add the dates and begin planning.
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
            <PaperAirplaneIcon className="h-5 w-5 -rotate-12" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        <div>
          <label htmlFor="destination" className="field-label">
            Destination
          </label>
          <div className="input-shell">
            <MapPinIcon className="h-5 w-5 flex-none text-violet-400" />
            <input
              id="destination"
              type="text"
              name="destination"
              placeholder="Tokyo, Paris, Cape Town..."
              value={form.destination}
              onChange={handleChange}
              className="input-control"
              maxLength={255}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="startDate" className="field-label">
              Start date
            </label>
            <div className="input-shell px-3">
              <CalendarDaysIcon className="hidden h-4 w-4 flex-none text-violet-400 sm:block" />
              <input
                id="startDate"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="input-control min-w-0 text-xs"
              />
            </div>
          </div>
          <div>
            <label htmlFor="endDate" className="field-label">
              End date
            </label>
            <div className="input-shell px-3">
              <CalendarDaysIcon className="hidden h-4 w-4 flex-none text-orange-400 sm:block" />
              <input
                id="endDate"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="input-control min-w-0 text-xs"
              />
            </div>
          </div>
        </div>

        {error ? (
          <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">
            {error}
          </p>
        ) : null}

        <button type="submit" className="primary-button w-full justify-center" disabled={loading}>
          <PlusIcon className="h-4 w-4" />
          {loading ? 'Creating your trip...' : 'Create trip'}
        </button>
      </form>
    </div>
  );
}
