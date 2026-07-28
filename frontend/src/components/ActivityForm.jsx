import { useState } from 'react';
import {
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const EMPTY_FORM = { title: '', activityDate: '', notes: '' };

export default function ActivityForm({ tripId, onAdd, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) return setError('Enter an activity title.');
    if (!form.activityDate) return setError('Select a date for the activity.');

    const created = await onAdd(tripId, form);
    if (created) setForm(EMPTY_FORM);
  };

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-violet-100 bg-gradient-to-b from-white to-violet-50/70 shadow-sm">
      <div className="border-b border-violet-100/80 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg">
            <SparklesIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-violet-500">
              Add a moment
            </p>
            <h4 className="font-display text-xl font-semibold text-slate-900">Plan an activity</h4>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        <div>
          <label htmlFor="activityTitle" className="field-label">
            Activity
          </label>
          <div className="input-shell bg-white">
            <ClipboardDocumentListIcon className="h-5 w-5 flex-none text-violet-400" />
            <input
              id="activityTitle"
              type="text"
              name="title"
              placeholder="Museum visit, dinner, city tour..."
              value={form.title}
              onChange={handleChange}
              className="input-control"
              maxLength={255}
              autoComplete="off"
            />
          </div>
        </div>

        <div>
          <label htmlFor="activityDate" className="field-label">
            Date
          </label>
          <div className="input-shell bg-white">
            <CalendarDaysIcon className="h-5 w-5 flex-none text-orange-400" />
            <input
              id="activityDate"
              type="date"
              name="activityDate"
              value={form.activityDate}
              onChange={handleChange}
              className="input-control"
            />
          </div>
        </div>

        <div>
          <label htmlFor="activityNotes" className="field-label">
            Notes
          </label>
          <textarea
            id="activityNotes"
            name="notes"
            placeholder="Booking details, reminders, ideas, or helpful notes..."
            value={form.notes}
            onChange={handleChange}
            rows={4}
            className="textarea-control"
            maxLength={1000}
          />
        </div>

        {error ? (
          <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">
            {error}
          </p>
        ) : null}

        <button type="submit" className="primary-button w-full justify-center" disabled={loading}>
          <PlusIcon className="h-4 w-4" />
          {loading ? 'Adding to itinerary...' : 'Add activity'}
        </button>
      </form>
    </div>
  );
}
