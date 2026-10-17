import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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
  // Supabase Auth State & Methods
  session: Session | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
  isSupabaseConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    name?: string
  ) => Promise<{ error: string | null; message?: string }>;
  signOut: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;

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

  // Supabase Auth State
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isDemoAuth, setIsDemoAuth] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('rsa_demo_auth') === 'true' : false;
  });

  const isAuthenticated = Boolean(session?.user || (isDemoAuth && !isSupabaseConfigured));

  // Initialize and listen to Supabase Auth state
  useEffect(() => {
    let isMounted = true;

    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
        if (!isMounted) return;
        if (error) {
          console.warn('Supabase getSession error:', error.message);
        }
        setSession(currentSession);
        setSupabaseUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          const email = currentSession.user.email || '';
          const name =
            currentSession.user.user_metadata?.full_name ||
            currentSession.user.user_metadata?.name ||
            (email ? email.split('@')[0] : '');
          setUser((prev) => ({
            ...prev,
            id: currentSession.user.id || prev.id,
            email: prev.email || email,
            name: prev.name || name,
          }));
        }
        setAuthLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        if (!isMounted) return;
        setSession(currentSession);
        setSupabaseUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          const email = currentSession.user.email || '';
          const name =
            currentSession.user.user_metadata?.full_name ||
            currentSession.user.user_metadata?.name ||
            (email ? email.split('@')[0] : '');
          setUser((prev) => ({
            ...prev,
            id: currentSession.user.id || prev.id,
            email: prev.email || email,
            name: prev.name || name,
          }));
        }
        setAuthLoading(false);
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    } else {
      const savedDemo = localStorage.getItem('rsa_demo_auth') === 'true';
      if (savedDemo) {
        setIsDemoAuth(true);
      }
      setAuthLoading(false);
    }
  }, []);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    setAuthError(null);

    if (!isSupabaseConfigured) {
      if (!email.trim() || !password) {
        return { error: 'Please enter both email and password.' };
      }
      setIsDemoAuth(true);
      localStorage.setItem('rsa_demo_auth', 'true');
      const cleanEmail = email.trim();
      const defaultName = cleanEmail.split('@')[0];
      setUser((prev) => ({
        ...prev,
        email: cleanEmail,
        name: prev.name || defaultName,
      }));
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
        return { error: error.message };
      }

      if (data.session) {
        setSession(data.session);
        setSupabaseUser(data.user);
        const userEmail = data.user.email || email.trim();
        const userName =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          userEmail.split('@')[0];

        setUser((prev) => ({
          ...prev,
          id: data.user.id || prev.id,
          email: userEmail,
          name: prev.name || userName,
        }));
      }
      return { error: null };
    } catch (err: any) {
      const msg = err?.message || 'Failed to sign in. Please verify your credentials.';
      setAuthError(msg);
      return { error: msg };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name?: string
  ): Promise<{ error: string | null; message?: string }> => {
    setAuthError(null);

    if (!isSupabaseConfigured) {
      if (!email.trim() || !password) {
        return { error: 'Please enter both email and password.' };
      }
      if (password.length < 6) {
        return { error: 'Password must be at least 6 characters.' };
      }
      setIsDemoAuth(true);
      localStorage.setItem('rsa_demo_auth', 'true');
      const cleanEmail = email.trim();
      const resolvedName = name?.trim() || cleanEmail.split('@')[0];
      setUser((prev) => ({
        ...prev,
        email: cleanEmail,
        name: resolvedName,
      }));
      return { error: null, message: 'Account registered and session active.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name?.trim() || email.split('@')[0],
            name: name?.trim() || email.split('@')[0],
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        return { error: error.message };
      }

      if (data.session) {
        setSession(data.session);
        setSupabaseUser(data.user);
        const userEmail = data.user?.email || email.trim();
        const userName =
          name?.trim() ||
          data.user?.user_metadata?.full_name ||
          userEmail.split('@')[0];

        setUser((prev) => ({
          ...prev,
          id: data.user?.id || prev.id,
          email: userEmail,
          name: userName,
        }));
        return { error: null, message: 'Registration successful!' };
      } else if (data.user && !data.session) {
        return {
          error: null,
          message:
            'Registration successful! Please check your email to verify your address before logging in.',
        };
      }

      return { error: null };
    } catch (err: any) {
      const msg = err?.message || 'Failed to sign up.';
      setAuthError(msg);
      return { error: msg };
    }
  };

  const signOut = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Sign out error:', err);
    } finally {
      setSession(null);
      setSupabaseUser(null);
      setIsDemoAuth(false);
      localStorage.removeItem('rsa_demo_auth');
      setAuthError(null);
      setActiveTab((prev) => (prev === 'dashboard' || prev === 'profile' ? 'home' : prev));
    }
  };

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
        session,
        supabaseUser,
        isAuthenticated,
        authLoading,
        authError,
        isSupabaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
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
