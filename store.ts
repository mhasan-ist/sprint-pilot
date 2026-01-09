
import { useState, useCallback, useMemo } from 'react';
import { UserStory, Sprint, Squad, SprintSquad, StoryAssignment, ViewMode, MandaysByRole, TaskSchedule, Project } from './types';
import { getWorkingDays, calculateAutoSchedule } from './engine';
import { 
  INITIAL_PROJECTS, 
  INITIAL_STORIES, 
  INITIAL_SQUADS, 
  INITIAL_SPRINTS, 
  INITIAL_SPRINT_SQUADS, 
  INITIAL_ASSIGNMENTS 
} from './seedData';

export const useSprintStore = () => {
  const [projects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(INITIAL_PROJECTS[0].id);
  
  const [stories, setStories] = useState<UserStory[]>(INITIAL_STORIES);
  const [sprints] = useState<Sprint[]>(INITIAL_SPRINTS);
  const [squads] = useState<Squad[]>(INITIAL_SQUADS);
  const [sprintSquads, setSprintSquads] = useState<SprintSquad[]>(INITIAL_SPRINT_SQUADS);
  const [assignments, setAssignments] = useState<StoryAssignment[]>(INITIAL_ASSIGNMENTS);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [selectedSprintSquadId, setSelectedSprintSquadId] = useState<string | null>(null);

  const [isSandboxMode, setIsSandboxMode] = useState(false);
  const [mainSprintSquads, setMainSprintSquads] = useState<SprintSquad[]>(INITIAL_SPRINT_SQUADS);
  const [mainAssignments, setMainAssignments] = useState<StoryAssignment[]>(INITIAL_ASSIGNMENTS);

  // Computed: Filtered Data based on Active Project
  const activeProject = useMemo(() => projects.find(p => p.id === activeProjectId)!, [projects, activeProjectId]);
  const projectStories = useMemo(() => stories.filter(s => s.projectId === activeProjectId), [stories, activeProjectId]);
  const projectSprints = useMemo(() => sprints.filter(s => s.projectId === activeProjectId), [sprints, activeProjectId]);
  const projectSquads = useMemo(() => squads.filter(s => s.projectId === activeProjectId), [squads, activeProjectId]);
  
  const projectSprintSquads = useMemo(() => {
    const sprintIds = projectSprints.map(s => s.id);
    return sprintSquads.filter(ss => sprintIds.includes(ss.sprintId));
  }, [sprintSquads, projectSprints]);

  const enterSandbox = useCallback(() => {
    setMainSprintSquads([...sprintSquads]);
    setMainAssignments([...assignments]);
    setIsSandboxMode(true);
  }, [sprintSquads, assignments]);

  const commitSandbox = useCallback(() => {
    setIsSandboxMode(false);
  }, []);

  const discardSandbox = useCallback(() => {
    setSprintSquads([...mainSprintSquads]);
    setAssignments([...mainAssignments]);
    setIsSandboxMode(false);
  }, [mainSprintSquads, mainAssignments]);

  const addStory = useCallback((story: UserStory) => {
    setStories(prev => [...prev, { ...story, projectId: activeProjectId }]);
  }, [activeProjectId]);

  const addStories = useCallback((newStories: UserStory[]) => {
    setStories(prev => [...prev, ...newStories.map(s => ({ ...s, projectId: activeProjectId }))]);
  }, [activeProjectId]);

  const updateStory = useCallback((story: UserStory) => {
    setStories(prev => prev.map(s => s.id === story.id ? story : s));
  }, []);

  const deleteStory = useCallback((id: string) => {
    setStories(prev => prev.filter(s => s.id !== id));
    setAssignments(prev => prev.filter(a => a.userStoryId !== id));
  }, []);

  const updateSprintSquadMembers = useCallback((id: string, members: MandaysByRole) => {
    setSprintSquads(prev => prev.map(ss => ss.id === id ? { ...ss, membersByRole: members } : ss));
  }, []);

  const updateTaskSchedule = useCallback((storyId: string, sprintSquadId: string, schedule: TaskSchedule) => {
    setAssignments(prev => prev.map(a => 
      (a.userStoryId === storyId && a.sprintSquadId === sprintSquadId) 
        ? { ...a, schedule } 
        : a
    ));
  }, []);

  const optimizeSchedulesForSprintSquad = useCallback((sprintSquadId: string) => {
    const ss = sprintSquads.find(s => s.id === sprintSquadId);
    if (!ss) return;
    const sprint = sprints.find(s => s.id === ss.sprintId);
    if (!sprint) return;

    const workingDays = getWorkingDays(sprint.startDate, sprint.endDate);
    
    setAssignments(prev => prev.map(a => {
        if (a.sprintSquadId !== sprintSquadId) return a;
        const story = stories.find(s => s.id === a.userStoryId);
        if (!story) return a;
        return {
            ...a,
            schedule: calculateAutoSchedule(story, workingDays)
        };
    }));
  }, [stories, sprintSquads, sprints]);

  const assignStory = useCallback((storyId: string, sprintSquadId: string | null) => {
    setAssignments(prev => {
      const filtered = prev.filter(a => a.userStoryId !== storyId);
      if (!sprintSquadId) return filtered;
      
      const ss = sprintSquads.find(s => s.id === sprintSquadId);
      const sprint = sprints.find(s => s.id === ss?.sprintId);
      const story = stories.find(s => s.id === storyId);
      
      const workingDays = sprint ? getWorkingDays(sprint.startDate, sprint.endDate) : 10;
      const defaultSchedule = story ? calculateAutoSchedule(story, workingDays) : { beOffset: 0, mobOffset: 0, qaOffset: 5 };

      return [...filtered, { 
        userStoryId: storyId, 
        sprintSquadId, 
        schedule: defaultSchedule
      }];
    });
  }, [stories, sprintSquads, sprints]);

  const addSprintSquad = useCallback((sprintId: string, squadId: string) => {
    const newSprintSquad: SprintSquad = {
        id: `SS-${sprintId}-${squadId}`,
        sprintId,
        squadId,
        membersByRole: { backend: 2, android: 2, ios: 2, qa: 2, qaAutomation: 1 }
    };
    setSprintSquads(prev => [...prev, newSprintSquad]);
  }, []);

  const getUnassignedStories = useMemo(() => {
    const assignedIds = assignments.map(a => a.userStoryId);
    return projectStories.filter(s => !assignedIds.includes(s.id));
  }, [projectStories, assignments]);

  const getStoriesForSprintSquad = useCallback((sprintSquadId: string) => {
    const storyIds = assignments
      .filter(a => a.sprintSquadId === sprintSquadId)
      .map(a => a.userStoryId);
    return projectStories.filter(s => storyIds.includes(s.id));
  }, [projectStories, assignments]);

  const getAssignmentForStory = useCallback((storyId: string) => {
    return assignments.find(a => a.userStoryId === storyId) || null;
  }, [assignments]);

  return {
    projects,
    activeProjectId,
    activeProject,
    stories: projectStories, // Scoped to active project
    sprints: projectSprints, // Scoped to active project
    squads: projectSquads,   // Scoped to active project
    sprintSquads: projectSprintSquads, // Scoped to active project
    storeStories: stories, // Global access if needed
    storeAssignments: assignments, // Global access
    assignments,
    viewMode,
    selectedSprintSquadId,
    isSandboxMode,
    setActiveProjectId,
    setViewMode,
    setSelectedSprintSquadId,
    enterSandbox,
    commitSandbox,
    discardSandbox,
    addStory,
    addStories,
    updateStory,
    deleteStory,
    updateSprintSquadMembers,
    updateTaskSchedule,
    optimizeSchedulesForSprintSquad,
    assignStory,
    getUnassignedStories,
    getStoriesForSprintSquad,
    getAssignmentForStory,
    addSprintSquad,
  };
};

export type SprintStore = ReturnType<typeof useSprintStore>;
