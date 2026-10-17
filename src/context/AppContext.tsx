import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Project,
  Skill,
  Syllabus,
  Course,
  Module,
  ModuleResource,
  REPDimension,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_PROJECTS,
  INITIAL_SKILLS,
  INITIAL_SYLLABI,
  INITIAL_COURSES,
  SAMPLE_DEMO_DATA,
} from '../initialData';

interface AppContextType {
  user: User;
  updateUser: (updated: Partial<User>) => void;
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => Project;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleProjectMilestone: (projectId: string, milestoneId: string) => void;
  addProjectMilestone: (projectId: string, title: string, dueDate?: string) => void;
  updateProjectStatus: (projectId: string, status: Project['status']) => void;
  skills: Skill[];
  addSkills: (newSkills: Array<Omit<Skill, 'id' | 'user_id'>>) => void;
  updateSkill: (id: string, updated: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  syllabi: Syllabus[];
  addSyllabus: (syllabus: Omit<Syllabus, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Syllabus;
  deleteSyllabus: (id: string) => void;
  addModuleToSyllabus: (syllabusId: string, module: Omit<Module, 'id' | 'syllabus_id'>) => void;
  addResourceToModule: (syllabusId: string, moduleId: string, resource: ModuleResource) => void;
  awardVerifiedSkillFromModule: (skill: Omit<Skill, 'id' | 'user_id'>) => void;
  updateModuleStatus: (
    syllabusId: string,
    moduleId: string,
    status: Module['completion_status'],
    userReflection?: string,
    userNotes?: string
  ) => void;
  updateModuleQuizAndRubric: (
    syllabusId: string,
    moduleId: string,
    answers: number[],
    score: number,
    repScores?: any
  ) => void;
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Course;
  updateCourse: (id: string, updated: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  activeTab: 'home' | 'dashboard' | 'assess' | 'learn' | 'teach' | 'profile';
  setActiveTab: (tab: 'home' | 'dashboard' | 'assess' | 'learn' | 'teach' | 'profile') => void;
  selectedSyllabusId: string | null;
  setSelectedSyllabusId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  resetAllData: () => void;
  loadDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'rsa_clean_user_v1',
  PROJECTS: 'rsa_clean_projects_v1',
  SKILLS: 'rsa_clean_skills_v1',
  SYLLABI: 'rsa_clean_syllabi_v1',
  COURSES: 'rsa_clean_courses_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Purge legacy storage keys from prototype if present
  useEffect(() => {
    const legacyKeys = [
      'rsa_user',
      'rsa_user_v1',
      'rsa_user_v2',
      'rsa_projects',
      'rsa_projects_v2',
      'rsa_skills',
      'rsa_skills_v2',
      'rsa_syllabi',
      'rsa_syllabi_v2',
      'rsa_courses',
      'rsa_courses_v2',
    ];
    legacyKeys.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        // ignore
      }
    });
  }, []);

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SKILLS);
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });

  const [syllabi, setSyllabi] = useState<Syllabus[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SYLLABI);
    return saved ? JSON.parse(saved) : INITIAL_SYLLABI;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'assess' | 'learn' | 'teach' | 'profile'>('home');
  const [selectedSyllabusId, setSelectedSyllabusId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SYLLABI, JSON.stringify(syllabi));
  }, [syllabi]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  const updateUser = (updated: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProj: Project = {
      ...projectData,
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      assessedAt: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) => [newProj, ...prev]);
    return newProj;
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProjectMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const milestones = (p.milestones || []).map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        return { ...p, milestones };
      })
    );
  };

  const addProjectMilestone = (projectId: string, title: string, dueDate?: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newM = {
          id: 'm_' + Math.random().toString(36).substring(2, 9),
          title,
          completed: false,
          dueDate,
        };
        return { ...p, milestones: [...(p.milestones || []), newM] };
      })
    );
  };

  const updateProjectStatus = (projectId: string, status: Project['status']) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status } : p))
    );
  };

  const addSkills = (newSkills: Array<Omit<Skill, 'id' | 'user_id'>>) => {
    const formatted: Skill[] = newSkills.map((s) => ({
      ...s,
      id: 'skl_' + Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      added_at: new Date().toISOString().split('T')[0],
    }));
    setSkills((prev) => [...formatted, ...prev]);
  };

  const updateSkill = (id: string, updated: Partial<Skill>) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const addSyllabus = (data: Omit<Syllabus, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString().split('T')[0];
    const newSyl: Syllabus = {
      ...data,
      id: 'syl_' + Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      created_at: now,
      updated_at: now,
    };
    setSyllabi((prev) => [newSyl, ...prev]);
    return newSyl;
  };

  const updateModuleStatus = (
    syllabusId: string,
    moduleId: string,
    status: Module['completion_status'],
    userReflection?: string,
    userNotes?: string
  ) => {
    const now = new Date().toISOString().split('T')[0];
    setSyllabi((prev) =>
      prev.map((syl) => {
        if (syl.id !== syllabusId) return syl;
        const updatedModules = syl.modules.map((m) => {
          if (m.id !== moduleId) return m;
          return {
            ...m,
            completion_status: status,
            completed_at: status === 'Completed' ? now : undefined,
            lesson_content: m.lesson_content
              ? {
                  ...m.lesson_content,
                  user_reflection: userReflection !== undefined ? userReflection : m.lesson_content.user_reflection,
                  user_notes: userNotes !== undefined ? userNotes : m.lesson_content.user_notes,
                }
              : undefined,
          };
        });
        return {
          ...syl,
          modules: updatedModules,
          updated_at: now,
        };
      })
    );
  };

  const updateModuleQuizAndRubric = (
    syllabusId: string,
    moduleId: string,
    answers: number[],
    score: number,
    repScores?: any
  ) => {
    const now = new Date().toISOString().split('T')[0];
    setSyllabi((prev) =>
      prev.map((syl) => {
        if (syl.id !== syllabusId) return syl;
        const updatedModules = syl.modules.map((m) => {
          if (m.id !== moduleId) return m;
          return {
            ...m,
            lesson_content: m.lesson_content
              ? {
                  ...m.lesson_content,
                  userQuizAnswers: answers,
                  userQuizScore: score,
                  repSelfAssessment: repScores || m.lesson_content.repSelfAssessment,
                }
              : undefined,
          };
        });
        return {
          ...syl,
          modules: updatedModules,
          updated_at: now,
        };
      })
    );
  };

  const addCourse = (data: Omit<Course, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString().split('T')[0];
    const newCrs: Course = {
      ...data,
      id: 'crs_' + Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      created_at: now,
      updated_at: now,
    };
    setCourses((prev) => [newCrs, ...prev]);
    return newCrs;
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    const now = new Date().toISOString().split('T')[0];
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated, updated_at: now } : c)));
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const deleteSyllabus = (id: string) => {
    setSyllabi((prev) => prev.filter((s) => s.id !== id));
    if (selectedSyllabusId === id) {
      setSelectedSyllabusId(null);
    }
  };

  const addModuleToSyllabus = (syllabusId: string, moduleData: Omit<Module, 'id' | 'syllabus_id'>) => {
    const newMod: Module = {
      ...moduleData,
      id: 'mod_' + Math.random().toString(36).substring(2, 9),
      syllabus_id: syllabusId,
    };
    setSyllabi((prev) =>
      prev.map((s) => (s.id === syllabusId ? { ...s, modules: [...s.modules, newMod] } : s))
    );
  };

  const addResourceToModule = (syllabusId: string, moduleId: string, resource: ModuleResource) => {
    setSyllabi((prev) =>
      prev.map((s) => {
        if (s.id !== syllabusId) return s;
        return {
          ...s,
          modules: s.modules.map((m) =>
            m.id === moduleId
              ? { ...m, resources: [...m.resources, resource] }
              : m
          ),
        };
      })
    );
  };

  const awardVerifiedSkillFromModule = (skillData: Omit<Skill, 'id' | 'user_id'>) => {
    addSkills([skillData]);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    localStorage.removeItem(STORAGE_KEYS.SYLLABI);
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    setUser(INITIAL_USER);
    setProjects(INITIAL_PROJECTS);
    setSkills(INITIAL_SKILLS);
    setSyllabi(INITIAL_SYLLABI);
    setCourses(INITIAL_COURSES);
  };

  const loadDemoData = () => {
    setUser(SAMPLE_DEMO_DATA.user);
    setProjects(SAMPLE_DEMO_DATA.projects);
    setSkills(SAMPLE_DEMO_DATA.skills);
    setSyllabi(SAMPLE_DEMO_DATA.syllabi);
    setCourses(SAMPLE_DEMO_DATA.courses);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        projects,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectMilestone,
        addProjectMilestone,
        updateProjectStatus,
        skills,
        addSkills,
        updateSkill,
        deleteSkill,
        syllabi,
        addSyllabus,
        deleteSyllabus,
        addModuleToSyllabus,
        addResourceToModule,
        awardVerifiedSkillFromModule,
        updateModuleStatus,
        updateModuleQuizAndRubric,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        activeTab,
        setActiveTab,
        selectedSyllabusId,
        setSelectedSyllabusId,
        selectedProjectId,
        setSelectedProjectId,
        resetAllData,
        loadDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
