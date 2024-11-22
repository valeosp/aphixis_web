export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  enrollmentDate: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  time: string;
  status: 'present' | 'absent';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'reminder' | 'note' | 'motivation';
  createdAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  todayAbsences: number;
  peakHour: string;
}
