import { useState, useEffect } from 'react';
import type { WorkoutEntry } from './types';

const STORAGE_KEY = 'burrow_workouts_v1';

function load(): WorkoutEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(entries: WorkoutEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useWorkouts() {
  const [entries, setEntries] = useState<WorkoutEntry[]>(load);

  useEffect(() => {
    save(entries);
  }, [entries]);

  function addEntry(entry: Omit<WorkoutEntry, 'id' | 'createdAt'>) {
    const newEntry: WorkoutEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setEntries(prev => [newEntry, ...prev]);
  }

  function deleteEntry(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  return { entries, addEntry, deleteEntry };
}
