import { useState } from 'react';
import { EXERCISES, type Exercise } from './types';
import { useWorkouts } from './useWorkouts';
import WeeklyChart from './WeeklyChart';

const EXERCISE_ICONS: Record<Exercise, string> = {
  'Bench Press': '🏋️',
  'Squat': '🦵',
  'Deadlift': '⚡',
  'Overhead Press': '💪',
  'Pull Up': '🔝',
  'Push Up': '↑',
  'Bicep Curl': '🦾',
  'Plank': '🧘',
};

function todayDate() {
  return new Date().toISOString().split('T')[0];
}

export default function App() {
  const { entries, addEntry, deleteEntry } = useWorkouts();
  const [exercise, setExercise] = useState<Exercise>('Bench Press');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const today = todayDate();
  const todayEntries = entries.filter(e => e.date === today);
  const isBodyweight = ['Pull Up', 'Push Up', 'Plank'].includes(exercise);

  const todayVolume = todayEntries.reduce(
    (sum, e) => sum + e.sets * e.reps * (e.weight || 1),
    0
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const s = parseInt(sets);
    const r = parseInt(reps);
    const w = parseFloat(weight) || 0;
    if (!s || s < 1 || !r || r < 1) {
      setError('Sets and reps must be at least 1.');
      return;
    }
    addEntry({ exercise, sets: s, reps: r, weight: isBodyweight ? 0 : w, date: today });
    setError('');
    setShowForm(false);
    setSets('3');
    setReps('10');
    setWeight('');
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800">
      <header className="bg-amber-700 text-white px-4 py-5 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workout Logger</h1>
            <p className="text-amber-200 text-sm mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => { setShowForm(v => !v); setError(''); }}
            className="bg-amber-500 hover:bg-amber-400 text-white rounded-full w-12 h-12 text-2xl flex items-center justify-center shadow transition-colors"
            aria-label="Log workout"
          >
            {showForm ? '✕' : '+'}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-5 space-y-5">
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
            <h2 className="text-base font-semibold text-stone-700 mb-4">Log a Set</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Exercise</label>
                <div className="grid grid-cols-2 gap-2">
                  {EXERCISES.map(ex => (
                    <button key={ex} type="button"
                      onClick={() => { setExercise(ex); setWeight(''); }}
                      className={`text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                        exercise === ex
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-amber-400'
                      }`}
                    >
                      {EXERCISE_ICONS[ex]} {ex}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Sets</label>
                  <input type="number" inputMode="numeric" min="1" max="99"
                    value={sets} onChange={e => setSets(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-2 text-center text-lg font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Reps</label>
                  <input type="number" inputMode="numeric" min="1" max="999"
                    value={reps} onChange={e => setReps(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-2 text-center text-lg font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                    {isBodyweight ? 'BW' : 'lbs'}
                  </label>
                  <input type="number" inputMode="decimal" min="0" step="2.5"
                    value={isBodyweight ? '' : weight}
                    onChange={e => setWeight(e.target.value)}
                    disabled={isBodyweight}
                    placeholder={isBodyweight ? '—' : '0'}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2 py-2 text-center text-lg font-semibold focus:outline-none focus:border-amber-500 disabled:opacity-40"
                  />
                </div>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl py-3 transition-colors shadow-sm"
              >
                Save Entry
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm text-center">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Today's Volume</p>
            <p className="text-3xl font-bold text-amber-700 mt-1">{todayVolume.toLocaleString()}</p>
            <p className="text-xs text-stone-400 mt-0.5">lbs lifted</p>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm text-center">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Sets Done</p>
            <p className="text-3xl font-bold text-amber-700 mt-1">{todayEntries.reduce((s, e) => s + e.sets, 0)}</p>
            <p className="text-xs text-stone-400 mt-0.5">{todayEntries.length} exercise{todayEntries.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <WeeklyChart entries={entries} />

        <div>
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">Today's Log</h2>
          {todayEntries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center shadow-sm">
              <p className="text-stone-400 text-sm">No entries yet. Tap + to log a workout.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayEntries.map(entry => (
                <div key={entry.id} className="bg-white rounded-2xl border border-stone-200 px-4 py-3 flex items-center shadow-sm">
                  <span className="text-2xl mr-3">{EXERCISE_ICONS[entry.exercise]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800 text-sm truncate">{entry.exercise}</p>
                    <p className="text-stone-500 text-xs mt-0.5">
                      {entry.sets} sets × {entry.reps} reps
                      {entry.weight > 0 ? ` @ ${entry.weight} lbs` : ' (bodyweight)'}
                    </p>
                  </div>
                  <button onClick={() => deleteEntry(entry.id)}
                    className="ml-3 text-stone-300 hover:text-red-400 transition-colors text-lg flex-shrink-0"
                    aria-label="Delete"
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {entries.some(e => e.date !== today) && (
          <div>
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">History</h2>
            <div className="space-y-2">
              {entries.filter(e => e.date !== today).slice(0, 30).map(entry => (
                <div key={entry.id} className="bg-white rounded-2xl border border-stone-200 px-4 py-3 flex items-center shadow-sm opacity-80">
                  <span className="text-xl mr-3">{EXERCISE_ICONS[entry.exercise]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-700 text-sm truncate">{entry.exercise}</p>
                    <p className="text-stone-400 text-xs mt-0.5">
                      {entry.sets} × {entry.reps}
                      {entry.weight > 0 ? ` @ ${entry.weight}lbs` : ''}
                      {' · '}
                      {new Date(entry.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <button onClick={() => deleteEntry(entry.id)}
                    className="ml-3 text-stone-300 hover:text-red-400 transition-colors flex-shrink-0"
                    aria-label="Delete"
                  >✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-6" />
      </main>
    </div>
  );
}
