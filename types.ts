export type Role = 'backend' | 'android' | 'ios' | 'qa' | 'qaAutomation';

export interface MandaysByRole {
  backend: number;
  android: number;
  ios: number;
  qa: number;
  qaAutomation: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string; // Theme color for the project
}

export interface UserStory {
  id: string;
  projectId: string; // Linked to Project
  title: string;
  epic?: string;
  category?: 'Existing' | 'Future' | 'New Feature' | 'Foundation';
  mandaysByRole: MandaysByRole;
  dependencies: string[];
}

export interface Sprint {
  id: string;
  projectId: string; // Sprints are project-specific
  name: string;
  startDate: string; 
  endDate: string;   
  capacityFactor: number; 
}

export interface Squad {
  id: string;
  projectId: string; // Squads assigned to project
  name: string;
}

export interface SprintSquad {
  id: string;
  sprintId: string;
  squadId: string;
  membersByRole: MandaysByRole;
}

export interface TaskSchedule {
  beOffset: number;
  mobOffset: number;
  qaOffset: number;
}

export interface StoryAssignment {
  userStoryId: string;
  sprintSquadId: string;
  schedule?: TaskSchedule;
}

export interface CapacityMetric {
  availableMandays: MandaysByRole;
  assignedMandays: MandaysByRole;
  utilization: MandaysByRole;
  totalUtilization: number;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  HELICOPTER = 'HELICOPTER',
  GANTT = 'GANTT'
}

export interface PlanningIssue {
  type: 'OVERLOAD' | 'DEPENDENCY_VIOLATION' | 'UNASSIGNED_DEPENDENCY';
  severity: 'HIGH' | 'MEDIUM';
  message: string;
  storyId?: string;
  sprintSquadId?: string;
  sprintId?: string;
}