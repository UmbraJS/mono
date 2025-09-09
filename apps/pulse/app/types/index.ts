export interface WorkHours {
  value: number;
  expected: number;
}

export interface Workday {
  name: string;
  date: string;
  hours: WorkHours;
  project: string[];
  place: string;
  mood: {
    value: number;
    reason: string;
  };
}
