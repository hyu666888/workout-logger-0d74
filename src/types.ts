export type Exercise =
  | 'Bench Press'
  | 'Squat'
  | 'Deadlift'
  | 'Overhead Press'
  | 'Pull Up'
  | 'Push Up'
  | 'Bicep Curl'
  | 'Plank'
  | 'Lunge';

export const EXERCISES: Exercise[] = [
  'Bench Press',
  'Squat',
  'Deadlift',
  'Overhead Press',
  'Pull Up',
  'Push Up',
  'Bicep Curl',
  'Plank',
  'Lunge',
];

export interface WorkoutEntry {
  id: string;
  exercise: Exercise;
  sets: number;
  reps: number;
  weight: number; // lbs; 0 for bodyweight
  date: string; // YYYY-MM-DD
  createdAt: number;
}
