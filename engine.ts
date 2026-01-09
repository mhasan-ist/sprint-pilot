import { Sprint, SprintSquad, UserStory, MandaysByRole, CapacityMetric, StoryAssignment, PlanningIssue, TaskSchedule } from './types';

/**
 * Calculates working days between two dates (excluding weekends)
 */
export const getWorkingDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const dayOfWeek = cur.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
};

/**
 * Generates an optimized schedule based on task handovers
 */
export const calculateAutoSchedule = (story: UserStory, maxDays: number): TaskSchedule => {
  const beMd = Math.ceil(story.mandaysByRole.backend);
  const mobMd = Math.ceil(Math.max(story.mandaysByRole.android, story.mandaysByRole.ios));
  
  // Logic: BE starts Day 0. Mobile starts after BE finishes. QA starts after Mobile finishes.
  const beOffset = 0;
  const mobOffset = Math.min(beOffset + beMd, maxDays - 1);
  const qaOffset = Math.min(mobOffset + mobMd, maxDays - 1);

  return { beOffset, mobOffset, qaOffset };
};

/**
 * Core engine to calculate metrics for a specific SprintSquad
 */
export const calculateSprintSquadMetrics = (
  sprint: Sprint,
  sprintSquad: SprintSquad,
  assignedStories: UserStory[]
): CapacityMetric => {
  const workingDays = getWorkingDays(sprint.startDate, sprint.endDate);
  const effectiveDays = workingDays * sprint.capacityFactor;

  const available: MandaysByRole = {
    backend: sprintSquad.membersByRole.backend * effectiveDays,
    android: sprintSquad.membersByRole.android * effectiveDays,
    ios: sprintSquad.membersByRole.ios * effectiveDays,
    qa: sprintSquad.membersByRole.qa * effectiveDays,
    qaAutomation: sprintSquad.membersByRole.qaAutomation * effectiveDays,
  };

  const assigned: MandaysByRole = assignedStories.reduce(
    (acc, story) => ({
      backend: acc.backend + story.mandaysByRole.backend,
      android: acc.android + story.mandaysByRole.android,
      ios: acc.ios + story.mandaysByRole.ios,
      qa: acc.qa + story.mandaysByRole.qa,
      qaAutomation: acc.qaAutomation + story.mandaysByRole.qaAutomation,
    }),
    { backend: 0, android: 0, ios: 0, qa: 0, qaAutomation: 0 }
  );

  const utilization: MandaysByRole = {
    backend: available.backend > 0 ? (assigned.backend / available.backend) * 100 : 0,
    android: available.android > 0 ? (assigned.android / available.android) * 100 : 0,
    ios: available.ios > 0 ? (assigned.ios / available.ios) * 100 : 0,
    qa: available.qa > 0 ? (assigned.qa / available.qa) * 100 : 0,
    qaAutomation: available.qaAutomation > 0 ? (assigned.qaAutomation / available.qaAutomation) * 100 : 0,
  };

  const totalAvailable = Object.values(available).reduce((a, b) => a + b, 0);
  const totalAssigned = Object.values(assigned).reduce((a, b) => a + b, 0);
  const totalUtilization = totalAvailable > 0 ? (totalAssigned / totalAvailable) * 100 : 0;

  return {
    availableMandays: available,
    assignedMandays: assigned,
    utilization,
    totalUtilization
  };
};

export const getStatusColor = (utilization: number): { bg: string, text: string, border: string } => {
  if (utilization > 110) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
  if (utilization >= 91 || (utilization >= 50 && utilization < 70)) 
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  if (utilization >= 70 && utilization <= 90) 
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  return { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' };
};

/**
 * Validates dependencies for a specific story
 */
export const checkDependencyViolations = (
  story: UserStory,
  assignments: StoryAssignment[],
  sprintSquads: SprintSquad[],
  sprints: Sprint[]
): string[] => {
  const violations: string[] = [];
  const myAssignment = assignments.find(a => a.userStoryId === story.id);
  
  if (!myAssignment) return [];

  const mySS = sprintSquads.find(ss => ss.id === myAssignment.sprintSquadId);
  if (!mySS) return [];

  const mySprint = sprints.find(s => s.id === mySS.sprintId);
  if (!mySprint) return [];

  const mySprintIndex = sprints.findIndex(s => s.id === mySprint.id);

  for (const depId of story.dependencies) {
    const depAssignment = assignments.find(a => a.userStoryId === depId);
    
    if (!depAssignment) {
      violations.push(depId); 
      continue;
    }

    const depSS = sprintSquads.find(ss => ss.id === depAssignment.sprintSquadId);
    if (!depSS) {
      violations.push(depId);
      continue;
    }

    const depSprintIndex = sprints.findIndex(s => s.id === depSS.sprintId);
    if (depSprintIndex > mySprintIndex) {
      violations.push(depId);
    }
  }

  return violations;
};

/**
 * Performs a global health check of the entire plan
 */
export const validateFullPlan = (
  stories: UserStory[],
  sprints: Sprint[],
  sprintSquads: SprintSquad[],
  assignments: StoryAssignment[]
): PlanningIssue[] => {
  const issues: PlanningIssue[] = [];

  // Check 1: Capacity Overloads
  sprintSquads.forEach(ss => {
    const sprint = sprints.find(s => s.id === ss.sprintId);
    if (!sprint) return;

    const assignedIds = assignments.filter(a => a.sprintSquadId === ss.id).map(a => a.userStoryId);
    const assignedStories = stories.filter(s => assignedIds.includes(s.id));
    const metrics = calculateSprintSquadMetrics(sprint, ss, assignedStories);

    if (metrics.totalUtilization > 110) {
      issues.push({
        type: 'OVERLOAD',
        severity: 'HIGH',
        message: `${ss.squadId} in ${sprint.name} is overloaded (${metrics.totalUtilization.toFixed(0)}%)`,
        sprintSquadId: ss.id,
        sprintId: sprint.id
      });
    } else if (metrics.totalUtilization > 90) {
      issues.push({
        type: 'OVERLOAD',
        severity: 'MEDIUM',
        message: `${ss.squadId} in ${sprint.name} is near capacity (${metrics.totalUtilization.toFixed(0)}%)`,
        sprintSquadId: ss.id,
        sprintId: sprint.id
      });
    }
  });

  // Check 2: Dependency Violations
  assignments.forEach(a => {
    const story = stories.find(s => s.id === a.userStoryId);
    if (!story) return;

    const violations = checkDependencyViolations(story, assignments, sprintSquads, sprints);
    violations.forEach(v => {
      const isAssigned = assignments.find(as => as.userStoryId === v);
      
      issues.push({
        type: isAssigned ? 'DEPENDENCY_VIOLATION' : 'UNASSIGNED_DEPENDENCY',
        severity: 'HIGH',
        message: `${story.id} depends on ${v}, but ${v} is ${isAssigned ? 'scheduled later' : 'not scheduled'}`,
        storyId: story.id
      });
    });
  });

  return issues;
};