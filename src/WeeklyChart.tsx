import type { WorkoutEntry } from './types';

interface Props {
  entries: WorkoutEntry[];
}

function getWeekDays(): { date: string; label: string }[] {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const date = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    days.push({ date, label });
  }
  return days;
}

export default function WeeklyChart({ entries }: Props) {
  const days = getWeekDays();

  const repsByDay: Record<string, number> = {};
  for (const day of days) repsByDay[day.date] = 0;
  for (const e of entries) {
    if (e.date in repsByDay) {
      repsByDay[e.date] += e.sets * e.reps;
    }
  }

  const maxReps = Math.max(...Object.values(repsByDay), 1);
  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
      <h2 className="text-sm font-semibold text-amber-800 uppercase tracking-wider mb-4">
        Weekly Reps
      </h2>
      <div className="flex items-end gap-2 h-28">
        {days.map(({ date, label }) => {
          const reps = repsByDay[date];
          const heightPct = Math.round((reps / maxReps) * 100);
          const isToday = date === todayDate;
          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-1">
              {reps > 0 && (
                <span className="text-xs text-amber-700 font-medium">{reps}</span>
              )}
              <div className="w-full flex items-end" style={{ height: '80px' }}>
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    isToday ? 'bg-amber-600' : 'bg-amber-300'
                  }`}
                  style={{ height: `${Math.max(heightPct, reps > 0 ? 4 : 0)}%` }}
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  isToday ? 'text-amber-800' : 'text-stone-500'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
