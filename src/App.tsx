/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, ReactNode, useEffect } from 'react';
import { 
  LayoutDashboard, 
  NotebookPen, 
  GraduationCap, 
  ClipboardCheck,
  Menu,
  X,
  BookOpen,
  Clock,
  Trophy,
  Calendar,
  Settings as SettingsIcon,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit2,
  Check,
  Filter,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Section = 'Dashboard' | 'Notes' | 'Learn' | 'Test' | 'Settings';

interface Task {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

function LogoWithFire({ size = 'large' }: { size?: 'small' | 'large' }) {
  const [isFireActive, setIsFireActive] = useState(false);
  const [fireColor, setFireColor] = useState<'blue' | 'red'>('blue');
  const [tapCount, setTapCount] = useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleTap = () => {
    if (!isFireActive) {
      // Start cycle
      setIsFireActive(true);
      setFireColor('blue');
      setTapCount(1);
      
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsFireActive(false);
        setTapCount(0);
      }, 5000);
    } else {
      // Already active, check for 3 more taps
      const newCount = tapCount + 1;
      setTapCount(newCount);
      
      if (newCount >= 4) {
        setFireColor('red');
      }
    }
  };

  const fireParticles = [...Array(12)];
  const colorHex = fireColor === 'blue' ? '#3b82f6' : '#ef4444';

  return (
    <div 
      onClick={handleTap}
      className="flex items-center gap-3 cursor-pointer relative group"
    >
      <div className="relative">
        <img 
          src="/logo.svg" 
          alt="Zanshin Logo" 
          className={size === 'large' ? "w-10 h-10 relative z-10" : "w-8 h-8 relative z-10"}
          referrerPolicy="no-referrer"
        />
        
        <AnimatePresence>
          {isFireActive && (
            <div className="absolute inset-0 z-0">
              {fireParticles.map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1.2, 0.5],
                    rotate: [0, 360],
                    x: Math.cos((i * 30) * (Math.PI / 180)) * (size === 'large' ? 25 : 20),
                    y: Math.sin((i * 30) * (Math.PI / 180)) * (size === 'large' ? 25 : 20),
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1/2 left-1/2 w-3 h-3 blur-[2px] rounded-full"
                  style={{ backgroundColor: colorHex }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        <h1 className={`${size === 'large' ? 'text-2xl' : 'text-xl'} font-display font-bold tracking-tight text-white uppercase italic relative z-10`}>
          Zanshin
        </h1>
        
        <AnimatePresence>
          {isFireActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -inset-x-4 -inset-y-2 z-0 pointer-events-none"
            >
              <motion.div 
                animate={{ 
                  boxShadow: `0 0 20px ${colorHex}44`,
                  borderColor: colorHex
                }}
                className="absolute inset-0 border border-transparent rounded-lg"
              />
              {/* Revolving text fire */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`text-${i}`}
                  animate={{ 
                    x: [0, 100, 0],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.3,
                    ease: "linear"
                  }}
                  className="absolute h-px w-8 blur-[1px]"
                  style={{ 
                    backgroundColor: colorHex,
                    top: `${15 + (i * 15)}%`,
                    left: '-10%'
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // User Name State
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('zanshin_user_name') || 'John';
  });

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('zanshin_tasks');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', title: 'Biology Quiz Prep', time: 'Tomorrow at 10:00 AM', completed: false },
      { id: '2', title: 'Math Assignment', time: 'Today at 4:00 PM', completed: false },
      { id: '3', title: 'History Reading', time: 'Friday at 2:00 PM', completed: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem('zanshin_tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Streak State with LocalStorage Persistence
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('zanshin_streak');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lastUpdate, setLastUpdate] = useState(() => {
    const saved = localStorage.getItem('zanshin_last_update');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Check for streak expiration on load
  useEffect(() => {
    const now = Date.now();
    const fortyEightHours = 48 * 60 * 60 * 1000;
    
    if (lastUpdate > 0 && (now - lastUpdate) >= fortyEightHours) {
      setStreak(0);
      localStorage.setItem('zanshin_streak', '0');
    }
  }, [lastUpdate]);

  useEffect(() => {
    const playSplashSound = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        
        const audioCtx = new AudioContextClass();
        
        const playHit = (freq: number, time: number, duration: number, volume: number) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, time);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.8, time + duration);
          
          gain.gain.setValueAtTime(0.001, time);
          gain.gain.exponentialRampToValueAtTime(volume, time + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.start(time);
          osc.stop(time + duration);
        };

        // Cinematic "Ta-Dum" synthesis
        const now = audioCtx.currentTime;
        playHit(80, now, 0.8, 0.5); // The "Ta"
        playHit(60, now + 0.15, 3.0, 0.7); // The "Dum" (deeper and longer)
        
        // Add a subtle high-frequency chime for "Zanshin" clarity
        const chime = audioCtx.createOscillator();
        const chimeGain = audioCtx.createGain();
        chime.type = 'triangle';
        chime.frequency.setValueAtTime(440, now + 0.15);
        chime.frequency.exponentialRampToValueAtTime(880, now + 0.3);
        chime.frequency.exponentialRampToValueAtTime(440, now + 1.5);
        chimeGain.gain.setValueAtTime(0.001, now + 0.15);
        chimeGain.gain.exponentialRampToValueAtTime(0.1, now + 0.3);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
        chime.connect(chimeGain);
        chimeGain.connect(audioCtx.destination);
        chime.start(now + 0.15);
        chime.stop(now + 2.0);

      } catch (e) {
        console.error("Audio playback failed:", e);
      }
    };

    // Trigger sound on mount (might be blocked by browser)
    playSplashSound();

    // Also trigger on first click if splash is still visible (to bypass autoplay block)
    const handleInteraction = () => {
      playSplashSound();
      window.removeEventListener('click', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);

    const timer = setTimeout(() => {
      setShowSplash(false);
      window.removeEventListener('click', handleInteraction);
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleInteraction);
    };
  }, []);

  const handleOpenNote = () => {
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const fortyEightHours = 48 * 60 * 60 * 1000;
    const diff = now - lastUpdate;

    if (lastUpdate === 0 || diff >= fortyEightHours) {
      // First time or streak lost
      const newStreak = 1;
      setStreak(newStreak);
      setLastUpdate(now);
      localStorage.setItem('zanshin_streak', newStreak.toString());
      localStorage.setItem('zanshin_last_update', now.toString());
    } else if (diff >= twentyFourHours && diff < fortyEightHours) {
      // Valid window for increment
      const newStreak = streak + 1;
      setStreak(newStreak);
      setLastUpdate(now);
      localStorage.setItem('zanshin_streak', newStreak.toString());
      localStorage.setItem('zanshin_last_update', now.toString());
    }
    // If diff < twentyFourHours, do nothing as per requirement
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Notes', icon: NotebookPen },
    { name: 'Learn', icon: GraduationCap },
    { name: 'Test', icon: ClipboardCheck },
    { name: 'Settings', icon: SettingsIcon },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <DashboardPlaceholder streak={streak} setStreak={setStreak} userName={userName} tasks={tasks} setTasks={setTasks} onContinueTraining={() => setActiveSection('Notes')} />;
      case 'Notes':
        return <NotesPlaceholder onOpenNote={handleOpenNote} />;
      case 'Learn':
        return <LearnPlaceholder />;
      case 'Test':
        return <TestPlaceholder />;
      case 'Settings':
        return <SettingsPlaceholder userName={userName} setUserName={setUserName} />;
      default:
        return <DashboardPlaceholder streak={streak} setStreak={setStreak} userName={userName} tasks={tasks} setTasks={setTasks} onContinueTraining={() => setActiveSection('Notes')} />;
    }
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black flex items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 0.9] }}
              transition={{ 
                duration: 5, 
                times: [0, 0.3, 0.7, 1],
                ease: "easeInOut" 
              }}
              className="flex flex-col items-center gap-8"
            >
              <img 
                src="/logo.svg" 
                alt="Zanshin Logo" 
                className="w-40 h-40"
              />
              <div className="text-center">
                <h1 className="font-display font-bold text-5xl tracking-[0.2em] text-white uppercase italic mb-2">Zanshin</h1>
                <p className="text-zinc-500 text-sm tracking-[0.5em] uppercase font-light">Focus • Presence • Spirit</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-black border-r border-zinc-800 p-6 sticky top-0 h-screen">
        <div className="mb-10">
          <LogoWithFire size="large" />
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveSection(item.name as Section)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeSection === item.name
                  ? 'bg-zinc-900 text-white font-semibold border border-zinc-700'
                  : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold border border-zinc-700">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-xs text-zinc-500">Pro Student</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-black border-b border-zinc-800 sticky top-0 z-50">
        <LogoWithFire size="small" />
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-400"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-[65px] bg-black z-40 p-6 flex flex-col"
          >
            <nav className="space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveSection(item.name as Section);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-lg transition-all ${
                    activeSection === item.name
                      ? 'bg-zinc-900 text-white font-bold border border-zinc-700'
                      : 'text-zinc-500'
                  }`}
                >
                  <item.icon size={24} />
                  {item.name}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        <header className="mb-8">
          <h2 className="text-3xl font-display font-bold text-white">{activeSection}</h2>
          <p className="text-zinc-500 mt-1">Welcome back! Here's what's happening today.</p>
        </header>

        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderSection()}
        </motion.div>
      </main>
    </div>
    </>
  );
}

function DashboardPlaceholder({ streak, setStreak, userName, tasks, setTasks, onContinueTraining }: { 
  streak: number, 
  setStreak: (s: number | ((prev: number) => number)) => void, 
  userName: string,
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  onContinueTraining: () => void
}) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isManagementMode, setIsManagementMode] = useState(false);

  const toggleTask = (id: string) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(newTasks);
    
    // Check if all tasks are completed
    const allCompleted = newTasks.every(t => t.completed);
    const previouslyAllCompleted = tasks.every(t => t.completed);
    
    if (allCompleted && !previouslyAllCompleted && newTasks.length > 0) {
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 4000);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditTime(task.time);
  };

  const saveEdit = () => {
    if (editingTaskId) {
      setTasks(tasks.map(t => t.id === editingTaskId ? { ...t, title: editTitle, time: editTime } : t));
      setEditingTaskId(null);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'New Task',
      time: 'Set time',
      completed: false
    };
    setTasks([...tasks, newTask]);
    startEditing(newTask);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white/10 backdrop-blur-xl p-12 rounded-[40px] border border-white/20 flex flex-col items-center gap-6 shadow-2xl">
              <motion.div
                initial={{ rotate: -45, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white"
              >
                <Check size={48} strokeWidth={4} />
              </motion.div>
              <div className="text-center">
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">All Tasks Complete!</h2>
                <p className="text-emerald-400 font-bold tracking-widest uppercase text-sm">Zanshin Mastered</p>
              </div>
              {/* Confetti-like particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 400, 
                    y: (Math.random() - 0.5) * 400,
                    opacity: 0,
                    rotate: Math.random() * 360
                  }}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                  className="absolute w-2 h-2 bg-emerald-400 rounded-sm"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl p-8 text-black relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Maintain Zanshin, {userName}.</h3>
            <p className="text-zinc-600 mb-6 max-w-md">Your focus is your greatest asset. Stay present and keep your streak alive.</p>
            <div className="flex items-center gap-4">
              <button 
                onClick={onContinueTraining}
                className="bg-black text-white px-6 py-2.5 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
              >
                Continue Training
              </button>
            </div>
          </div>
          <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-black/5 rounded-full blur-3xl"></div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex flex-col items-center md:items-start gap-2">
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.2em]">Current Streak</p>
                <div className="flex items-center gap-4">
                  <h4 className="text-7xl font-display font-black text-white">{streak}</h4>
                  <p className="text-2xl font-bold text-zinc-400">Days</p>
                </div>
              </div>

              <div className="relative w-48 h-48 flex items-center justify-center">
                <FireAnimation streak={streak} />
              </div>
            </div>
            
            {/* Background Glow */}
            <motion.div 
              animate={{ 
                backgroundColor: 
                  streak < 3 ? 'transparent' :
                  streak < 5 ? '#eab308' : // yellow-500
                  streak <= 10 ? '#3b82f6' : // blue-500
                  streak <= 15 ? '#22c55e' : // green-500
                  streak <= 20 ? '#ef4444' : // red-500
                  '#ffffff', // white
                opacity: streak < 3 ? 0 : 0.1
              }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 blur-3xl pointer-events-none" 
            />
          </div>
        </div>
      </div>

      <div className="bg-black rounded-3xl p-6 border border-zinc-800 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold text-lg text-white">Tasks</h4>
          {isManagementMode && (
            <button 
              onClick={addTask}
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white hover:bg-zinc-800 transition-colors"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
        
        <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className={`group relative flex items-start gap-3 p-4 rounded-2xl transition-all border ${
                  task.completed 
                    ? 'bg-zinc-900/30 border-zinc-800/50 opacity-60' 
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`mt-1 transition-colors ${task.completed ? 'text-emerald-500' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                
                <div className="flex-1 min-w-0">
                  {editingTaskId === task.id ? (
                    <div className="space-y-2">
                      <input 
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-black border border-zinc-700 rounded-lg px-2 py-1 text-sm text-white outline-none focus:border-white"
                      />
                      <input 
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="w-full bg-black border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-400 outline-none focus:border-white"
                      />
                      <div className="flex gap-2 pt-1">
                        <button onClick={saveEdit} className="text-[10px] font-bold uppercase tracking-wider bg-white text-black px-2 py-1 rounded">Save</button>
                        <button onClick={() => setEditingTaskId(null)} className="text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-white px-2 py-1 rounded">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={`font-semibold text-sm transition-all ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-zinc-500">{task.time}</p>
                    </>
                  )}
                </div>

                {editingTaskId !== task.id && isManagementMode && (
                  <div className="flex gap-1">
                    <button 
                      onClick={() => startEditing(task)}
                      className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-zinc-600 text-sm">No tasks for today.</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => setIsManagementMode(!isManagementMode)}
          className={`w-full mt-6 py-3 font-semibold text-sm rounded-xl transition-all border ${
            isManagementMode 
              ? 'bg-white text-black border-white' 
              : 'text-white hover:bg-zinc-900 border-zinc-800'
          }`}
        >
          {isManagementMode ? 'Finish Editing' : 'Edit Tasks'}
        </button>
      </div>
    </div>
  );
}

function NotesPlaceholder({ onOpenNote }: { onOpenNote: () => void }) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleNoteClick = (note: any) => {
    onOpenNote();
    // In a real app, this would open the note detail
    console.log("Opening note:", note.chapter);
  };

  const classes = ['Class 8', 'Class 9', 'Class 10'];
  const subjects = ['Mathematics', 'Science', 'Social Science', 'Hindi', 'English'];

  // Mock data for notes
  const mockNotes = [
    { id: 1, class: 'Class 10', subject: 'Mathematics', chapter: 'Real Numbers', content: 'Fundamental Theorem of Arithmetic, Euclid\'s Division Lemma...' },
    { id: 2, class: 'Class 10', subject: 'Mathematics', chapter: 'Polynomials', content: 'Zeros of a polynomial, Relationship between zeros and coefficients...' },
    { id: 3, class: 'Class 10', subject: 'Science', chapter: 'Chemical Reactions', content: 'Types of chemical reactions, Balancing equations, Oxidation and reduction...' },
    { id: 4, class: 'Class 10', subject: 'Science', chapter: 'Life Processes', content: 'Nutrition, Respiration, Transportation, Excretion in plants and animals...' },
    { id: 5, class: 'Class 9', subject: 'Mathematics', chapter: 'Number Systems', content: 'Irrational numbers, Real numbers and their decimal expansions...' },
    { id: 6, class: 'Class 9', subject: 'Science', chapter: 'Matter in Our Surroundings', content: 'Physical nature of matter, States of matter, Evaporation...' },
    { id: 7, class: 'Class 8', subject: 'Mathematics', chapter: 'Rational Numbers', content: 'Properties of rational numbers, Representation on number line...' },
    { id: 8, class: 'Class 8', subject: 'Science', chapter: 'Crop Production', content: 'Agricultural practices, Basic practices of crop production...' },
    { id: 9, class: 'Class 10', subject: 'Social Science', chapter: 'Rise of Nationalism in Europe', content: 'The French Revolution, The Making of Nationalism...' },
    { id: 10, class: 'Class 9', subject: 'English', chapter: 'The Fun They Had', content: 'Margie and Tommy, The mechanical teacher, Schools of the future...' },
  ];

  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = note.chapter.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.class.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchQuery) return matchesSearch;
    
    if (selectedClass && selectedSubject) {
      return note.class === selectedClass && note.subject === selectedSubject;
    }
    
    return false;
  });

  const resetSelection = () => {
    setSelectedClass(null);
    setSelectedSubject(null);
    setSearchQuery('');
  };

  const resetSubject = () => {
    setSelectedSubject(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <button 
            onClick={resetSelection}
            className={`hover:text-white transition-colors ${!selectedClass && !searchQuery ? 'text-white font-bold' : 'text-zinc-500'}`}
          >
            {searchQuery ? 'Search Results' : 'All Notes'}
          </button>
          {selectedClass && !searchQuery && (
            <>
              <span className="text-zinc-700">/</span>
              <button 
                onClick={resetSubject}
                className={`hover:text-white transition-colors ${!selectedSubject ? 'text-white font-bold' : 'text-zinc-500'}`}
              >
                {selectedClass}
              </button>
            </>
          )}
          {selectedSubject && !searchQuery && (
            <>
              <span className="text-zinc-700">/</span>
              <span className="text-white font-bold">{selectedSubject}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text" 
              placeholder="Search chapters, subjects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-600 transition-all text-sm text-white"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              <Menu size={14} />
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 text-sm whitespace-nowrap ${
                isFilterOpen || selectedClass || selectedSubject 
                  ? 'bg-white text-black' 
                  : 'bg-zinc-900 text-white border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <Filter size={16} />
              Filter
              {(selectedClass || selectedSubject) && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1"></span>
              )}
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 p-4 space-y-4"
                >
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Class</label>
                    <div className="grid grid-cols-1 gap-1">
                      {classes.map(cls => (
                        <button
                          key={cls}
                          onClick={() => {
                            setSelectedClass(cls === selectedClass ? null : cls);
                            setSearchQuery('');
                          }}
                          className={`text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                            selectedClass === cls ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                          }`}
                        >
                          {cls}
                          {selectedClass === cls && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Subject</label>
                    <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto custom-scrollbar">
                      {subjects.map(sub => (
                        <button
                          key={sub}
                          onClick={() => {
                            setSelectedSubject(sub === selectedSubject ? null : sub);
                            setSearchQuery('');
                          }}
                          className={`text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                            selectedSubject === sub ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                          }`}
                        >
                          {sub}
                          {selectedSubject === sub && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      resetSelection();
                      setIsFilterOpen(false);
                    }}
                    className="w-full py-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors border-t border-zinc-800 mt-2 pt-4"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {searchQuery ? (
          <motion.div 
            key="search-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note) => (
                  <div 
                    key={note.id} 
                    onClick={() => handleNoteClick(note)}
                    className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-white bg-zinc-800 px-2 py-1 rounded-md">{note.class}</span>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded-md">{note.subject}</span>
                      </div>
                      <span className="text-xs text-zinc-500">Note</span>
                    </div>
                    <h4 className="font-bold text-white group-hover:text-zinc-300 transition-colors mb-2">{note.chapter}</h4>
                    <p className="text-sm text-zinc-400 line-clamp-3">{note.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
                <p className="text-zinc-500">No chapters found matching "{searchQuery}"</p>
              </div>
            )}
          </motion.div>
        ) : !selectedClass ? (
          <motion.div 
            key="classes"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {classes.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-white transition-all group text-left"
              >
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Select</p>
                <h4 className="text-2xl font-bold text-white group-hover:translate-x-1 transition-transform">{cls}</h4>
              </button>
            ))}
          </motion.div>
        ) : !selectedSubject ? (
          <motion.div 
            key="subjects"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-white transition-all group text-left"
              >
                <h4 className="font-bold text-white group-hover:text-zinc-300 transition-colors">{sub}</h4>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="notes-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div 
                  key={note.id} 
                  onClick={() => handleNoteClick(note)}
                  className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-white bg-zinc-800 px-2 py-1 rounded-md">{note.subject}</span>
                    <span className="text-xs text-zinc-500">Note</span>
                  </div>
                  <h4 className="font-bold text-white group-hover:text-zinc-300 transition-colors mb-2">{note.chapter}</h4>
                  <p className="text-sm text-zinc-400 line-clamp-3">{note.content}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-zinc-500">
                No notes available for this subject yet.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LearnPlaceholder() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-sm overflow-hidden relative">
          <h4 className="font-bold text-xl mb-4 text-white">Active Courses</h4>
          <div className="space-y-4">
            {['Advanced Mathematics', 'World History', 'Organic Chemistry'].map((course, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-zinc-800 text-white border border-zinc-700">
                  <BookOpen size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <p className="font-semibold text-sm text-zinc-200">{course}</p>
                    <p className="text-xs text-zinc-500">{45 + i * 10}%</p>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-white" style={{ width: `${45 + i * 10}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-8 text-white flex flex-col justify-center border border-zinc-800">
          <h4 className="text-2xl font-bold mb-2">Zanshin AI</h4>
          <p className="text-zinc-400 mb-6">Ask anything about your current subjects and get instant explanations.</p>
          <div className="relative">
            <input 
              type="text" 
              placeholder="How do black holes work?" 
              className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black px-4 py-2 rounded-xl font-bold text-sm">
              Ask
            </button>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-xl mb-4 text-white">Recommended for You</h4>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[280px] bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-sm hover:border-zinc-600 transition-all cursor-pointer">
              <img src={`https://picsum.photos/seed/study-${i}/400/200?grayscale`} alt="Course" className="w-full h-32 object-cover opacity-80" referrerPolicy="no-referrer" />
              <div className="p-4">
                <p className="text-xs font-bold text-zinc-500 mb-1 uppercase tracking-widest">NEW COURSE</p>
                <h5 className="font-bold text-white mb-2">Effective Time Management</h5>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Clock size={14} />
                  <span>2h 30m</span>
                  <span>•</span>
                  <span>12 Lessons</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestPlaceholder() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 text-center">
        <div className="w-20 h-20 bg-zinc-800 text-white rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-700">
          <ClipboardCheck size={40} />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-white">Ready to test your knowledge?</h3>
        <p className="text-zinc-500 mb-8 max-w-md mx-auto">Take a quick quiz to see how much you've retained from your recent study sessions.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <button className="bg-white text-black px-6 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5">
            Start Daily Quiz
          </button>
          <button className="bg-black border border-zinc-800 text-zinc-400 px-6 py-4 rounded-2xl font-bold hover:bg-zinc-900 transition-colors">
            Custom Practice
          </button>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-xl mb-4 text-white">Recent Results</h4>
        <div className="space-y-3">
          {[
            { subject: 'Mathematics', score: '92%', date: 'Today', status: 'Excellent' },
            { subject: 'History', score: '78%', date: 'Yesterday', status: 'Good' },
            { subject: 'Physics', score: '65%', date: '3 days ago', status: 'Needs Review' },
          ].map((result, i) => (
            <div key={i} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-800 text-white border border-zinc-700">
                  <Trophy size={20} />
                </div>
                <div>
                  <p className="font-bold text-white">{result.subject}</p>
                  <p className="text-xs text-zinc-500">{result.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-white">{result.score}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{result.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FireAnimation({ streak }: { streak: number }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  if (!isClient || streak < 3) return null;

  let colorValue = "#eab308"; // yellow-500
  let glowColor = "rgba(234, 179, 8, 0.5)";
  let scale = 1;

  if (streak >= 5 && streak <= 10) {
    colorValue = "#3b82f6"; // blue-500
    glowColor = "rgba(59, 130, 246, 0.5)";
  } else if (streak >= 11 && streak <= 15) {
    colorValue = "#22c55e"; // green-500
    glowColor = "rgba(34, 197, 94, 0.5)";
  } else if (streak >= 16 && streak <= 20) {
    colorValue = "#ef4444"; // red-500
    glowColor = "rgba(239, 68, 68, 0.5)";
  } else if (streak >= 21) {
    colorValue = "#ffffff"; // white
    glowColor = "rgba(255, 255, 255, 0.6)";
    scale = 1.4;
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: scale, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      <motion.div
        animate={{ 
          color: colorValue,
          filter: `drop-shadow(0 0 15px ${glowColor})`,
          scale: [1, 1.05, 1],
          rotate: [-1, 1, -1],
          y: [0, -5, 0]
        }}
        transition={{ 
          color: { duration: 0.8 },
          filter: { duration: 0.8 },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C12 2 7 5.5 7 10.5C7 13.5 9 15.5 12 15.5C15 15.5 17 13.5 17 10.5C17 5.5 12 2 12 2Z" />
          <path d="M12 6C12 6 9 8.5 9 11.5C9 13.5 10.5 14.5 12 14.5C13.5 14.5 15 13.5 15 11.5C15 8.5 12 6 12 6Z" opacity="0.6" />
          <path d="M12 22C12 22 18 18.5 18 13.5C18 10.5 16 8.5 13 8.5C10 8.5 8 10.5 8 13.5C8 18.5 12 22 12 22Z" opacity="0.4" />
        </svg>
      </motion.div>
      
      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(streak >= 21 ? 12 : 6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: -50 - Math.random() * 60,
              x: (Math.random() - 0.5) * 50,
              scale: [0, 1.5, 0],
              backgroundColor: colorValue
            }}
            transition={{ 
              duration: 1.2 + Math.random(), 
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut",
              backgroundColor: { duration: 0.8 }
            }}
            className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full shadow-[0_0_8px_currentColor]"
          />
        ))}
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, color }: { icon: ReactNode, label: string, value: string, color: string }) {
  return (
    <div className={`p-5 rounded-3xl ${color} border border-zinc-800 flex flex-col gap-2`}>
      <div className="bg-black w-10 h-10 rounded-xl flex items-center justify-center border border-zinc-800">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function SettingsPlaceholder({ userName, setUserName }: { userName: string, setUserName: (name: string) => void }) {
  const [inputValue, setInputValue] = useState(userName);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // A representative list of inappropriate words for filtering
  const BANNED_WORDS = [
    'fuck', 'shit', 'ass', 'bitch', 'bastard', 'cunt', 'dick', 'pussy', 
    'nigger', 'nigga', 'faggot', 'fag', 'dyke', 'tranny', 'retard', 'slut', 
    'whore', 'dumbass', 'idiot', 'hell', 'damn', 'piss', 'cock', 'bollocks', 
    'wanker', 'chink', 'spic', 'kike', 'wetback', 'gook', 'coon', 'paki', 
    'raghead', 'towelhead', 'junglebunny', 'cracker', 'honky', 'darkie', 
    'negro', 'rape', 'porn', 'sex', 'nude', 'naked', 'penis', 'vagina', 
    'clit', 'anus'
  ];

  const validateName = (name: string) => {
    // Normalize string to handle common character substitutions (leetspeak)
    let normalized = name.toLowerCase();
    
    // Common substitutions mapping
    const substitutions: { [key: string]: string } = {
      '@': 'a', '4': 'a', '3': 'e', '1': 'i', '!': 'i', '|': 'l', 
      '0': 'o', '5': 's', '$': 's', '7': 't', '+': 't', '8': 'b',
      '9': 'g', '6': 'g', '(': 'c', '<': 'c', '{': 'c', '[': 'c'
    };

    // Replace substituted characters
    let deobfuscated = "";
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized[i];
      deobfuscated += substitutions[char] || char;
    }

    // Check both original lowercase and deobfuscated version
    for (const word of BANNED_WORDS) {
      if (normalized.includes(word) || deobfuscated.includes(word)) {
        return false;
      }
    }
    
    // Also check for words with spaces or dots between letters (e.g., "f u c k")
    const stripped = normalized.replace(/[^a-z]/g, '');
    const strippedDeobfuscated = deobfuscated.replace(/[^a-z]/g, '');
    
    for (const word of BANNED_WORDS) {
      if (stripped.includes(word) || strippedDeobfuscated.includes(word)) {
        return false;
      }
    }

    return true;
  };

  const handleSave = () => {
    setError(null);
    setSuccess(false);

    if (!inputValue.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (!validateName(inputValue)) {
      setError("Please use an appropriate name. Don't use inappropriate or offensive language.");
      return;
    }

    setUserName(inputValue.trim());
    localStorage.setItem('zanshin_user_name', inputValue.trim());
    setSuccess(true);
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Profile Settings</h3>
            <p className="text-zinc-500">Customize your Zanshin experience</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="userName" className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Display Name
            </label>
            <div className="relative">
              <input
                id="userName"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:border-white transition-colors outline-none"
              />
            </div>
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-3 font-medium"
                >
                  {error}
                </motion.p>
              )}
              {success && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-emerald-500 text-sm mt-3 font-medium"
                >
                  Name updated successfully!
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="mt-8 p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800/50">
        <h4 className="font-bold text-white mb-2">Privacy Note</h4>
        <p className="text-sm text-zinc-500">
          Your name is stored locally on this device and is only used to personalize your dashboard experience.
        </p>
      </div>
    </div>
  );
}
