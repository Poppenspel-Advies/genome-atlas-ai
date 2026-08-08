import { useState, useCallback, useEffect, useRef } from 'react';
import {
  UploadArea,
  type InputMode,
} from './components/UploadArea';
import { SampleSpecimenGrid } from './components/SampleSpecimenGrid';
import type { SampleSpecimen } from './components/SampleSpecimens';
import { ResultView } from './components/ResultView';
import { NarrationPlayer } from './components/NarrationPlayer';
import { analyzeSpecimen, type AnalysisResult, type EvolutionaryOutcome } from './lib/api';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import { getSpecimenImageUrl } from './lib/imageGeneration';
import { InstructionGuide } from './components/InstructionGuide';
import { addAnalysisRecord, generateWeeklyReports, checkWeeklyReportDue } from './lib/analysisStore';
import type { UserLevel } from './lib/userLevels';
import { LEVELS, getDefaultLevel } from './lib/userLevels';
import { DinoArchiveView } from './components/views/DinoArchiveView';
import { ProjectsView } from './components/views/ProjectsView';
import { AIToolsView } from './components/views/AIToolsView';
import { IntegrationsView } from './components/views/IntegrationsView';
import { FossilLibraryView } from './components/views/FossilLibraryView';
import { TimelineExplorerView } from './components/views/TimelineExplorerView';
import { GenomeScannerView } from './components/views/GenomeScannerView';
import { CompareSpeciesView } from './components/views/CompareSpeciesView';
import { EvolutionSimulatorView } from './components/views/EvolutionSimulatorView';
import { MutationMapView } from './components/views/MutationMapView';
import { HistoryView } from './components/views/HistoryView';
import { TimeMachineView } from './components/views/TimeMachineView';
import { SubscriptionView } from './components/views/SubscriptionView';
import { SettingsView } from './components/views/SettingsView';
import { ProfileView } from './components/views/ProfileView';
import { ToastContainer } from './components/ToastContainer';
import { toast } from './lib/toastStore';
import {
  RotateCcw,
  AlertTriangle,
  Dna,
  Menu,
  Bot,
  Send,
  Loader2,
  Zap,
  Shield,
  Infinity as InfinityIcon,
  Sparkles,
  Atom,
  Image as ImageIcon,
  Check,
  X,
  LogIn,
  LogOut,
  Upload,
  Search,
  Users,
  ChevronRight,
  Camera,
  Mic,
  Video,
  LayoutDashboard,
  FolderKanban,
  Brain,
  CreditCard,
  Link2,
  Settings,
  Bell,
  History,
  BookOpen,
  Clock,
  Library,
  Scan,
  GitBranch,
  Activity,
  Radio,
  HelpCircle,
  FileText,
} from 'lucide-react';

// ── Constants ──────────────────────────────────────────────────────────
type AppState =
  | { phase: 'input' }
  | { phase: 'generating'; file: File | null; mode: InputMode; textDesc: string }
  | { phase: 'choose'; result: AnalysisResult; file: File | null; mode: InputMode; textDesc: string }
  | { phase: 'cube'; selectedOption: EvolutionaryOutcome; speciesName: string; file: File | null; mode: InputMode; textDesc: string }
  | { phase: 'error'; message: string; file: File | null; mode: InputMode; textDesc: string };

const GENERATION_STORY = [
  { icon: Dna, label: 'Decoding genetic blueprint...', sub: 'Reading base pairs across the genome' },
  { icon: Atom, label: 'Tracing evolutionary lineage...', sub: 'Mapping ancestral divergence points' },
  { icon: Zap, label: 'Simulating quantum mutations...', sub: 'Radiation-induced pathway modeling' },
  { icon: Sparkles, label: 'Generating alternate futures...', sub: 'Branching evolutionary timelines' },
  { icon: ImageIcon, label: 'Composing visual projections...', sub: 'Rendering phenotypic outcomes' },
];

interface StepDef { num: number; label: string; icon: typeof Upload; phaseKey: string }
const STEPS: StepDef[] = [
  { num: 1, label: 'Upload', icon: Upload, phaseKey: 'input' },
  { num: 2, label: 'Analyze', icon: Search, phaseKey: 'generating' },
  { num: 3, label: 'Choose', icon: Users, phaseKey: 'choose' },
  { num: 4, label: 'Time Machine', icon: InfinityIcon, phaseKey: 'cube' },
];

const INPUT_MODE_ICONS: Record<string, typeof Camera> = {
  photo: Camera, video: Video, audio: Mic, text: Send,
};
const INPUT_MODE_LABELS: Record<string, string> = {
  photo: 'Photo', video: 'Video', audio: 'Voice Note', text: 'Text description',
};

// ── Component ──────────────────────────────────────────────────────────
export default function App() {
  const [state, setState] = useState<AppState>({ phase: 'input' });
  const [progressStep, setProgressStep] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authSent, setAuthSent] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarActive, setSidebarActive] = useState<string>('analyze');
  const [currentView, setCurrentView] = useState<string>('workflow');
  const [showGuide, setShowGuide] = useState(false);
  const [userLevel, setUserLevel] = useState<UserLevel>(() => getDefaultLevel());
  const [reportDue, setReportDue] = useState(false);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check for weekly report on mount
  useEffect(() => {
    const due = checkWeeklyReportDue();
    if (due) setReportDue(true);
  }, []);

  // ── Navigate to a sidebar view ──
  const navigateTo = useCallback((view: string) => {
    setCurrentView(view);
    setSidebarActive(view);
  }, []);

  // ── Supabase auth listener ──
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  // ── Progress step animation ──
  const startProgress = useCallback(() => {
    setProgressStep(0);
    progressIntervalRef.current = setInterval(() => {
      setProgressStep((prev) => Math.min(prev + 1, GENERATION_STORY.length - 1));
    }, 2200);
  }, []);

  const stopProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopProgress();
  }, [stopProgress]);

  // ── Analysis ──
  const handleStartAnalysis = useCallback(async (file: File | null, mode: InputMode, textDesc: string) => {
    setState({ phase: 'generating', file, mode, textDesc });
    setSelectedIndex(null);
    startProgress();

    try {
      const input: Parameters<typeof analyzeSpecimen>[0] = {};

      if (mode === 'photo' && file) {
        input.imageBase64 = await fileToBase64(file);
      }

      if (mode === 'video' && file) {
        input.imageBase64 = await fileToBase64(file);
        input.transcription = '[Video submitted — transcription pending]';
      }

      if (mode === 'audio' && file) {
        input.transcription = '[Voice note submitted — transcription pending]';
      }

      if (mode === 'text' && textDesc.trim()) {
        input.textDescription = textDesc.trim();
      }

      if (textDesc.trim() && mode !== 'text') {
        input.textDescription = textDesc.trim();
      }

      const result = await analyzeSpecimen(input);

      // Convert each outcome's imagePrompt to a live Pollinations.ai image URL
      if (result.outcomes && !result.error) {
        result.outcomes = result.outcomes.map((o) => {
          if (!o.imageUrl && o.imagePrompt) {
            const { url } = getSpecimenImageUrl(o.imagePrompt);
            return { ...o, imageUrl: url };
          }
          return o;
        });
      }

      if (result.error) {
        if (result.error.includes('Could not identify')) {
          setState({
            phase: 'error',
            message: 'Could not identify a biological specimen. Try a clearer photo or provide more description.',
            file, mode, textDesc,
          });
        } else {
          setState({ phase: 'error', message: result.error, file, mode, textDesc });
        }
        return;
      }

      setState({ phase: 'choose', result, file, mode, textDesc });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong during analysis';
      setState({ phase: 'error', message, file, mode, textDesc });
    } finally {
      setTimeout(() => stopProgress(), 300);
    }
  }, [startProgress, stopProgress]);

  useEffect(() => {
    if (state.phase !== 'generating') stopProgress();
  }, [state.phase, stopProgress]);

  const handleSelect = useCallback((index: number) => {
    if (state.phase !== 'choose') return;
    setSelectedIndex(index);
    const option = state.result.outcomes[index];
    if (option) {
      // Save analysis to history store
      addAnalysisRecord({
        speciesName: state.result.speciesName,
        confidence: state.result.confidence,
        mode: state.mode,
        selectedPath: option.type,
        result: state.result,
      });
      // Check if report is due
      const due = checkWeeklyReportDue();
      if (due) setReportDue(true);
      toast.success('Analysis saved', `${state.result.speciesName} added to your history`);
    }
    setTimeout(() => {
      if (option) {
        setState({
          phase: 'cube',
          selectedOption: option,
          speciesName: state.result.speciesName,
          file: state.file,
          mode: state.mode,
          textDesc: state.textDesc,
        });
      }
    }, 600);
  }, [state]);

  const handleReset = useCallback(() => {
    stopProgress();
    setSelectedIndex(null);
    setState({ phase: 'input' });
  }, [stopProgress]);

  const handleRetry = useCallback(() => {
    if (state.phase === 'error') {
      handleStartAnalysis(state.file, state.mode, state.textDesc);
    }
  }, [state, handleStartAnalysis]);

  const handleSelectSample = useCallback((specimen: SampleSpecimen) => {
    // For text-based samples, submit the description directly
    if (specimen.type === 'text') {
      handleStartAnalysis(null, 'text', specimen.description);
      return;
    }
    // For image-based samples, we show a descriptive text since we can't
    // easily create a real File from an SVG. The description text is descriptive
    // enough for the AI to analyze.
    handleStartAnalysis(null, 'text', `Analyze this ${specimen.name}: ${specimen.description}`);
  }, [handleStartAnalysis]);

  const handleChatSend = useCallback(() => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');

    // Level-appropriate response
    let botResponse = '';
    if (userLevel === 'beginner') {
      botResponse = "🌱 That's a great question! Let me explain in simple terms. Evolution is how species change over time through small genetic variations. The key drivers are natural selection (survival of the fittest) and genetic drift (random changes). Would you like me to explain more about how our Time Machine works on your specimen?";
    } else if (userLevel === 'researcher') {
      botResponse = "🔬 Interesting research question! Based on current phylogenetic literature, I can discuss allele frequency shifts, selection coefficients, and molecular clocks. For your specific specimen, I'd recommend looking at the comparative genomics data. Would you like me to elaborate on any particular evolutionary mechanism?";
    } else {
      botResponse = "🧬 Scientific query received. I can provide detailed model parameters, pathway probabilities, and Monte Carlo simulation data. The current analysis uses a multi-model ensemble with Bayesian inference. What parameters would you like to explore?";
    }

    setChatMessages((prev) => [
      ...prev,
      { role: 'user', text: userMsg },
      { role: 'bot', text: botResponse },
    ]);
  }, [chatInput, userLevel]);

  // ── Auth handlers ──
  const handleSignIn = useCallback(async () => {
    if (!authEmail.trim()) return;
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: authEmail.trim(),
      options: { shouldCreateUser: true },
    });
    setAuthLoading(false);
    if (error) {
      console.error('Sign in error:', error.message);
      toast.error('Sign in failed', error.message);
      return;
    }
    setAuthSent(true);
    toast.success('Magic link sent', `Check ${authEmail.trim()} for your sign-in link`);
  }, [authEmail]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setShowAuthModal(false);
    toast.info('Signed out', 'You have been signed out successfully');
  }, []);

  // ── Subscription upgrade ──
  const handleUpgrade = useCallback((level: 'researcher' | 'scientist') => {
    setUserLevel(level);
    const levelLabel = LEVELS[level].label;
    toast.success(`Upgraded to ${levelLabel}`, `You now have ${level === 'scientist' ? 'unlimited analyses' : '50 analyses per month'}!`);
    setChatMessages((prev) => [
      ...prev,
      { role: 'bot', text: `🎉 Welcome to the ${levelLabel} tier! You now have access to ${level === 'researcher' ? '50 analyses per month, detailed scientific data, and comparative tools.' : 'unlimited analyses, genome scanning, and advanced simulation parameters.'}` },
    ]);
  }, []);

  // ── Clear history ──
  const clearHistory = useCallback(() => {
    localStorage.removeItem('genome_atlas_analyses');
  }, []);

  // ── Generate weekly report ──
  const generateReport = useCallback(() => {
    const reports = generateWeeklyReports();
    if (reports.length === 0) {
      toast.info('No reports yet', 'Analyze more species to generate your first weekly report');
      return;
    }
    const reportText = reports.map((r) =>
      `=== Genome Atlas AI Weekly Report ===\n` +
      `Week: ${r.weekStart} to ${r.weekEnd}\n` +
      `Species: ${r.species.join(', ')}\n` +
      `Analyses: ${r.analysesCount}\n` +
      `Dominant Path: ${r.topPath}\n` +
      `Summary: ${r.summary}\n` +
      `Predictions:\n${r.predictions.map((p) => `  - ${p}`).join('\n')}\n`
    ).join('\n---\n');
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genome-weekly-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setReportDue(false);
    toast.success('Report downloaded', 'Your weekly report has been generated and saved');
  }, []);

  // ── Derived ──
  const currentStepIndex = (() => {
    const map: Record<string, number> = { input: 0, generating: 1, choose: 2, cube: 3 };
    return map[state.phase] ?? 0;
  })();

  const artifactDescription = (() => {
    if (state.phase === 'input') return null;
    const f = state.file;
    const m = state.mode;
    const t = state.textDesc;
    if (m === 'text' && t) {
      return { icon: Send, label: t.slice(0, 60) + (t.length > 60 ? '...' : ''), desc: 'Text description' };
    }
    if (f) {
      return { icon: INPUT_MODE_ICONS[m] ?? Camera, label: f.name, desc: INPUT_MODE_LABELS[m] ?? m };
    }
    return null;
  })();

  return (
    <div className="flex min-h-screen bg-bg text-foreground">
      {/* Background atmospheric glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(139,92,246,0.06),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_80%_100%,rgba(255,45,149,0.04),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_20%_100%,rgba(255,215,0,0.03),transparent_70%)]" />
      </div>

      {/* ===== ALERT BANNER ===== */}
      {!alertDismissed && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-violet/20 via-pink/10 to-gold/10 border-b border-violet/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-foreground/80">
              <Dna className="w-3.5 h-3.5 text-violet" />
              <span className="font-medium">Genome Atlas AI</span>
              <span className="text-foreground-muted/60 hidden sm:inline">—</span>
              <span className="text-foreground-muted hidden sm:inline">Evolutionary Time Machine &middot; {LEVELS[userLevel].icon} {LEVELS[userLevel].label}</span>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <span className="text-[10px] text-gold hidden sm:inline">✨ Signed in as {user.email}</span>
              ) : (
                <span className="text-[10px] text-gold hidden sm:inline">✨ {LEVELS[userLevel].label} — {LEVELS[userLevel].analysisCredits === Infinity ? 'Unlimited' : `${LEVELS[userLevel].analysisCredits} credits`}</span>
              )}
              <button
                onClick={() => setAlertDismissed(true)}
                className="p-0.5 rounded text-foreground-muted/50 hover:text-foreground transition-colors"
                aria-label="Dismiss alert"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SIDEBAR ===== */}
      <aside className={`hidden lg:flex flex-col border-r border-border bg-surface/40 backdrop-blur-sm shrink-0 transition-all duration-300 relative z-10 ${
        sidebarCollapsed ? 'w-16' : 'w-60'
      }`}>
        {/* Animated gradient border glow */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-pink/20 via-violet/20 to-gold/20 pointer-events-none" />

        {/* ===== USER PROFILE — TOP (clickable to profile) ===== */}
        <div className="relative">
          <button onClick={() => navigateTo('profile')} className={`w-full flex items-center ${sidebarCollapsed ? 'flex-col pt-4 pb-3 px-0' : 'gap-3 px-4 pt-4 pb-3'} hover:opacity-80 transition-opacity`}>
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className={`rounded-full bg-gradient-to-br from-pink to-violet flex items-center justify-center text-white font-bold ${
                sidebarCollapsed ? 'w-10 h-10 text-xs' : 'w-9 h-9 text-[11px]'
              }`}>
                {user ? user.email?.[0]?.toUpperCase() ?? '?' : 'G'}
              </div>
              {/* Online dot */}
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-bg ${
                sidebarCollapsed ? 'w-2.5 h-2.5' : ''
              }`}>
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" />
              </div>
            </div>

            {/* User info */}
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate leading-tight">
                  {user ? user.email?.split('@')[0] ?? 'User' : 'Alex Reynolds'}
                </p>
                <p className="text-[9px] text-foreground-muted truncate">
                  {user ? user.email : 'alex@genome.ai'}
                </p>
              </div>
            )}

            {/* Notifications bell (expanded only) */}
            {!sidebarCollapsed && (
              <span className="relative p-1.5 rounded-lg text-foreground-muted/40 transition-all duration-200 cursor-default">
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-pink" />
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="mx-3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* ===== PRIMARY NAV ===== */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto scrollbar-thin">
          {/* Section: Main */}
          {!sidebarCollapsed && (
            <p className="px-2 mb-2 text-[8px] font-semibold text-foreground-muted/30 uppercase tracking-[0.15em]">
              Main
            </p>
          )}

          {/* Workspace */}
          <button
            onClick={() => navigateTo('workspace')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'workspace'
                ? 'bg-violet-dim border border-violet/20 text-violet'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <LayoutDashboard className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              sidebarActive === 'workspace' ? 'scale-110' : ''
            }`} />
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">Workspace</span>
                {sidebarActive === 'workspace' && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet animate-pulse-glow" />
                )}
              </>
            )}
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>

          {/* My Projects */}
          <button
            onClick={() => navigateTo('projects')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'projects'
                ? 'bg-violet-dim border border-violet/20 text-violet'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <FolderKanban className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              sidebarActive === 'projects' ? 'scale-110' : ''
            }`} />
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">My Projects</span>
                <span className="ml-auto px-1.5 py-0.5 rounded-md bg-surface-elevated border border-border text-[8px] text-foreground-muted">
                  3
                </span>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>

          {/* Section: Intelligence */}
          {!sidebarCollapsed && (
            <p className="px-2 mt-3 mb-2 text-[8px] font-semibold text-foreground-muted/30 uppercase tracking-[0.15em]">
              Intelligence
            </p>
          )}

          {/* AI Tools */}
          <button
            onClick={() => navigateTo('ai-tools')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'ai-tools'
                ? 'bg-pink-dim border border-pink/20 text-pink'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <Brain className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              sidebarActive === 'ai-tools' ? 'scale-110' : ''
            }`} />
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">AI Tools</span>
                {sidebarActive === 'ai-tools' && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-pink animate-pulse-glow" />
                )}
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>

          {/* Integrations */}
          <button
            onClick={() => navigateTo('integrations')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'integrations'
                ? 'bg-violet-dim border border-violet/20 text-violet'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <Link2 className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              sidebarActive === 'integrations' ? 'scale-110' : ''
            }`} />
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">Integrations</span>
                <span className="ml-auto px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[8px] text-emerald-400">
                  +2
                </span>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>

          {/* Section: Exploration */}
          {!sidebarCollapsed && (
            <p className="px-2 mt-3 mb-2 text-[8px] font-semibold text-foreground-muted/20 uppercase tracking-[0.15em]">
              Exploration
            </p>
          )}

          {/* Dino Archive */}
          <button
            onClick={() => navigateTo('dino-archive')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'dino-archive'
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              sidebarActive === 'dino-archive' ? 'scale-110' : ''
            }`} />
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">Dino Archive</span>
                <span className="ml-auto px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[8px] text-amber-400">12</span>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>

          {/* Fossil Library */}
          <button
            onClick={() => navigateTo('fossil-library')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'fossil-library'
                ? 'bg-violet-dim border border-violet/20 text-violet'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <Library className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              sidebarActive === 'fossil-library' ? 'scale-110' : ''
            }`} />
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">Fossil Library</span>
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet animate-pulse-glow" />
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>

          {/* Timeline Explorer */}
          <button
            onClick={() => navigateTo('timeline')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'timeline'
                ? 'bg-gold-dim border border-gold/20 text-gold'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              sidebarActive === 'timeline' ? 'scale-110' : ''
            }`} />
            {!sidebarCollapsed && (
              <span className="font-medium">Timeline Explorer</span>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>

          {/* Section: Genome */}
          {!sidebarCollapsed && (
            <p className="px-2 mt-3 mb-2 text-[8px] font-semibold text-foreground-muted/20 uppercase tracking-[0.15em]">
              Genome
            </p>
          )}

          {/* Genome Scanner */}
          <button
            onClick={() => navigateTo('scanner')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'scanner'
                ? 'bg-pink-dim border border-pink/20 text-pink'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <Scan className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              sidebarActive === 'scanner' ? 'scale-110' : ''
            }`} />
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">Genome Scanner</span>
                <div className="ml-auto px-1.5 py-0.5 rounded-md bg-pink/10 border border-pink/20 text-[8px] text-pink">AI</div>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>

          {/* Species Comparator */}
          <button
            onClick={() => navigateTo('compare')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'compare'
                ? 'bg-violet-dim border border-violet/20 text-violet'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <GitBranch className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              sidebarActive === 'compare' ? 'scale-110' : ''
            }`} />
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">Compare Species</span>
                <div className="ml-auto px-1.5 py-0.5 rounded-md bg-surface-elevated border border-border text-[8px] text-foreground-muted">Beta</div>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>

          {/* Evolution Simulator */}
          <button
            onClick={() => navigateTo('evolve')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'evolve'
                ? 'bg-pink-dim border border-pink/20 text-pink'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              sidebarActive === 'evolve' ? 'scale-110' : ''
            }`} />
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">Evolve Simulator</span>
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-pink animate-pulse-glow" />
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>

          {/* Mutation Map */}
          <button
            onClick={() => navigateTo('mutations')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'mutations'
                ? 'bg-gold-dim border border-gold/20 text-gold'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              sidebarActive === 'mutations' ? 'scale-110' : ''
            }`} />
            {!sidebarCollapsed && (
              <span className="font-medium">Mutation Map</span>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>

          {/* Section: Account */}
          {!sidebarCollapsed && (
            <p className="px-2 mt-3 mb-2 text-[8px] font-semibold text-foreground-muted/30 uppercase tracking-[0.15em]">
              Account
            </p>
          )}

          {/* Subscription */}
          <button
            onClick={() => navigateTo('subscription')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'subscription'
                ? 'bg-gold-dim border border-gold/20 text-gold'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <CreditCard className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              sidebarActive === 'subscription' ? 'scale-110' : ''
            }`} />
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">Subscription</span>
                <span className="ml-auto px-1.5 py-0.5 rounded-md bg-gold-dim border border-gold/20 text-[8px] text-gold">
                  {LEVELS[userLevel].price === 'Free' ? 'Free' : LEVELS[userLevel].label}
                </span>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>

          {/* Settings */}
          <button
            onClick={() => navigateTo('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'settings'
                ? 'bg-violet-dim border border-violet/20 text-violet'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <Settings className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              sidebarActive === 'settings' ? 'scale-110' : ''
            }`} />
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">Settings</span>
                {sidebarActive === 'settings' && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet animate-pulse-glow" />
                )}
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>

          {/* ===== PRIMARY TOOLS DIVIDER ===== */}
          <div className="mx-2 my-3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Analyze Species — Primary CTA */}
          <button
            onClick={() => { navigateTo('workflow'); handleReset(); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'analyze'
                ? 'bg-pink-dim border border-pink/20 text-pink shadow-[inset_0_0_15px_rgba(255,45,149,0.1)]'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <div className="relative">
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${sidebarActive === 'analyze' ? 'animate-pulse-glow' : ''}`} />
            </div>
            {!sidebarCollapsed && (
              <>
                <span className="font-semibold">Analyze Species</span>
                <div className="ml-auto px-1.5 py-0.5 rounded-md bg-pink/10 border border-pink/20 text-[8px] text-pink">
                  New
                </div>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>

          {/* History */}
          <button
            onClick={() => navigateTo('history')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'history'
                ? 'bg-violet-dim border border-violet/20 text-violet'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <History className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              sidebarActive === 'history' ? 'scale-110' : ''
            }`} />
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">History</span>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>

          {/* Time Machine */}
          <button
            onClick={() => navigateTo('time-machine')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 group relative overflow-hidden ${
              sidebarActive === 'time-machine' || state.phase === 'cube'
                ? 'bg-violet-dim border border-violet/20 text-violet'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            <InfinityIcon className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              sidebarActive === 'time-machine' || state.phase === 'cube' ? 'scale-110' : ''
            }`} />
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">Time Machine</span>
                {state.phase === 'cube' && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet animate-pulse-glow" />
                )}
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </button>
        </nav>

        {/* ===== PRO BOX ===== */}
        {!sidebarCollapsed && (
          <div className="relative mx-3 mb-3">
            {/* Animated border */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-pink/30 via-violet/30 to-gold/30 animate-pulse-glow blur-[1px]" />
            <div className="relative p-3 rounded-lg bg-gradient-to-br from-surface-elevated to-surface border border-white/5 overflow-hidden">
              {/* Glow overlay */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-violet-glow rounded-full blur-2xl opacity-20" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-3.5 h-3.5 text-gold" />
                  <p className="text-[11px] font-bold text-foreground">{userLevel === 'scientist' ? 'Genome Atlas Scientist' : 'Genome Atlas Pro'}</p>
                </div>
                <p className="text-[9px] text-foreground-muted leading-relaxed mb-2.5">
                  {userLevel === 'beginner' ? 'Unlock unlimited analyses, HD illustrations, and narrated timelines.' :
                   userLevel === 'researcher' ? 'Upgrade to Scientist for unlimited analyses, genome scanning, and API access.' :
                   'You have full access to all features.'}
                </p>
                {userLevel !== 'scientist' && (
                  <button
                    onClick={() => navigateTo('subscription')}
                    className="w-full py-1.5 rounded-md bg-gradient-to-r from-violet to-pink text-white text-[10px] font-semibold hover:opacity-90 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-200 active:scale-[0.97]"
                  >
                    {userLevel === 'beginner' ? 'Upgrade →' : 'Go Scientist →'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== BOTTOM SECTION ===== */}
        <div className="border-t border-border">
          <div className={`px-3 py-3 ${sidebarCollapsed ? 'flex flex-col items-center gap-2' : ''}`}>
            {/* Sign in / User */}
            {user ? (
              <div className={`flex items-center gap-2 ${sidebarCollapsed ? 'flex-col' : ''}`}>
                <div className="w-6 h-6 rounded-full bg-violet-dim border border-violet/30 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-violet">{user.email?.[0]?.toUpperCase() ?? '?'}</span>
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-medium text-foreground truncate">{user.email}</p>
                    <button onClick={handleSignOut} className="text-[8px] text-foreground-muted hover:text-pink transition-colors">
                      Sign out
                    </button>
                  </div>
                )}
                {sidebarCollapsed && (
                  <button onClick={handleSignOut} className="p-1 rounded text-foreground-muted hover:text-pink transition-colors" title="Sign out">
                    <LogOut className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs text-foreground-muted hover:text-foreground hover:border-border-glow transition-all duration-200 group ${
                  sidebarCollapsed ? 'justify-center p-2' : ''
                }`}
              >
                <LogIn className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
                {!sidebarCollapsed && 'Sign In'}
              </button>
            )}

            {/* Collapse toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-1 rounded text-foreground-muted/30 hover:text-foreground hover:bg-surface-elevated transition-all duration-200 ${
                sidebarCollapsed ? 'mt-2' : 'hidden'
              }`}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>

          {!sidebarCollapsed && (
            <div className="px-4 py-2 border-t border-border/50">
              <p className="text-[8px] text-foreground-muted/30 tracking-wider">v2.0 &middot; Genome Atlas AI</p>
            </div>
          )}
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col min-h-screen max-w-5xl mx-auto w-full">
        {/* ===== TOP PANEL ===== */}
        <header className={`flex items-center justify-between h-16 px-4 sm:px-6 border-b border-border bg-surface/20 backdrop-blur-sm ${
          !alertDismissed ? 'mt-[37px]' : ''
        }`}>
          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-all duration-200">
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Dna className="w-4 h-4 text-pink" />
              <span className="font-heading text-xs font-bold tracking-wide">Genome Atlas AI</span>
            </div>
          </div>

          {/* Step indicator */}
          <div className="hidden sm:flex items-center gap-0 mx-auto">
            {STEPS.map((step, i) => {
              const isActive = i === currentStepIndex;
              const isDone = i < currentStepIndex;
              const StepIcon = step.icon;
              return (
                <div key={step.num} className="flex items-center">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-500 ${
                    isActive
                      ? 'bg-violet-dim border border-violet/30'
                      : isDone
                      ? 'bg-pink-dim border border-pink/20'
                      : 'bg-transparent'
                  }`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isActive
                        ? 'bg-violet text-white'
                        : isDone
                        ? 'bg-pink text-white'
                        : 'bg-surface-elevated border border-white/10'
                    }`}>
                      {isDone ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <StepIcon className={`w-2.5 h-2.5 ${isActive ? 'text-white' : 'text-foreground-muted/50'}`} />
                      )}
                    </div>
                    <span className={`text-[9px] font-semibold uppercase tracking-wider transition-colors duration-500 ${
                      isActive ? 'text-violet' : isDone ? 'text-pink' : 'text-foreground-muted/40'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-6 h-px transition-colors duration-500 ${isDone ? 'bg-pink/40' : 'bg-white/5'}`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {/* Status dot */}
            <div className="hidden sm:flex items-center gap-1.5 mr-1">
              <span className="text-[9px] text-foreground-muted uppercase tracking-wider hidden md:inline">
                {state.phase === 'input' ? 'Ready' :
                 state.phase === 'generating' ? 'Processing' :
                 state.phase === 'choose' ? 'Choose' :
                 state.phase === 'cube' ? 'Viewing' :
                 'Error'}
              </span>
              <div className={`w-1.5 h-1.5 rounded-full ${
                state.phase === 'input' ? 'bg-foreground-muted' :
                state.phase === 'generating' ? 'bg-pink animate-pulse-glow' :
                state.phase === 'choose' ? 'bg-gold' :
                state.phase === 'cube' ? 'bg-violet' :
                'bg-destructive'
              }`} />
            </div>

            {/* New Analysis button */}
            {state.phase !== 'input' && state.phase !== 'generating' && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[11px] text-foreground-muted hover:text-foreground hover:border-border-glow transition-all duration-200 active:scale-[0.97]"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">New Analysis</span>
              </button>
            )}

            {/* AI Chat button */}
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-all duration-200 active:scale-[0.97] ${
                chatOpen
                  ? 'bg-pink/10 border border-pink/30 text-pink'
                  : 'border border-border text-foreground-muted hover:text-foreground hover:border-border-glow'
              }`}
            >
              <Bot className="w-3 h-3" />
              <span className="hidden sm:inline">AI Chat</span>
            </button>

            {/* Auth buttons (mobile) */}
            <div className="flex lg:hidden">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="p-1.5 rounded-lg text-foreground-muted hover:text-pink transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-all duration-200"
                  title="Sign in"
                >
                  <LogIn className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ===== AUTH MODAL ===== */}
        {showAuthModal && !user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowAuthModal(false)}>
            <div className="bg-surface border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-violet-dim border border-violet/20 mb-3">
                  <Dna className="w-5 h-5 text-violet" />
                </div>
                <h3 className="text-sm font-heading font-bold text-foreground mb-1">Sign in to Genome Atlas</h3>
                <p className="text-[11px] text-foreground-muted">Enter your email to receive a magic link</p>
              </div>
              {authSent ? (
                <div className="text-center py-4">
                  <Check className="w-8 h-8 text-gold mx-auto mb-2" />
                  <p className="text-xs text-foreground-muted">Check your inbox for the sign-in link!</p>
                  <button
                    onClick={() => { setShowAuthModal(false); setAuthSent(false); setAuthEmail(''); }}
                    className="mt-3 px-4 py-2 rounded-lg border border-border text-xs text-foreground-muted hover:text-foreground transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-foreground-muted/40 outline-none focus:border-violet/40 transition-colors mb-3"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSignIn(); }}
                  />
                  <button
                    onClick={handleSignIn}
                    disabled={authLoading || !authEmail.trim()}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet to-pink text-white text-xs font-semibold disabled:opacity-30 hover:opacity-90 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                  >
                    {authLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    {authLoading ? 'Sending...' : 'Send Magic Link'}
                  </button>
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="w-full mt-2 py-2 rounded-lg border border-border text-[11px] text-foreground-muted hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ===== INSTRUCTION GUIDE ===== */}
        <InstructionGuide open={showGuide} onClose={() => setShowGuide(false)} />

        {/* ===== FLOATING HELP BUTTON ===== */}
        <button
          onClick={() => setShowGuide(true)}
          className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-gradient-to-r from-violet to-pink text-white shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-[0.95]"
          title="How to use Genome Atlas"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* ===== TOAST NOTIFICATIONS ===== */}
        <ToastContainer />

        {/* ===== WEEKLY REPORT NOTIFICATION ===== */}
        {reportDue && !alertDismissed && (
          <div className="fixed top-[37px] left-0 right-0 z-40 bg-gradient-to-r from-gold/20 via-violet/10 to-pink/10 border-b border-gold/20 backdrop-blur-md animate-slide-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] text-foreground">
                <FileText className="w-3 h-3 text-gold" />
                <span>📊 Your weekly report is ready! <button onClick={generateReport} className="text-gold underline hover:no-underline">Download now</button></span>
              </div>
              <button onClick={() => setReportDue(false)} className="p-0.5 rounded text-foreground-muted/50 hover:text-foreground transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* ===== BODY ===== */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Main content area */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
            {/* Artifact pill (shown when not in input phase) */}
            {artifactDescription && (
              <div className="flex items-center gap-2 mb-4 animate-fade-in">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-elevated border border-white/5">
                  <artifactDescription.icon className="w-3 h-3 text-foreground-muted" />
                  <span className="text-[10px] text-foreground-muted truncate max-w-[120px] sm:max-w-[200px]">
                    {artifactDescription.label}
                  </span>
                  <span className="text-[9px] text-foreground-muted/40 px-1 py-0.5 rounded bg-black/30">
                    {artifactDescription.desc}
                  </span>
                </div>
              </div>
            )}

            {/* ===== WORKFLOW VIEW ===== */}
            {currentView === 'workflow' && (
              <>
                {/* Phase: Input */}
                {state.phase === 'input' && (
                  <div className="max-w-2xl mx-auto pt-4 animate-fade-in">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-dim border border-pink/20 mb-4">
                        <Dna className="w-7 h-7 text-pink" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-2 tracking-wide">
                        Evolutionary Time Machine
                      </h2>
                      <p className="text-sm text-foreground-muted max-w-md mx-auto leading-relaxed">
                        Upload any biological specimen &mdash; a photo, video, or voice note &mdash; and
                        explore three alternate evolutionary futures.
                      </p>
                    </div>
                    <UploadArea
                      onFileSelected={(file, mode, textDesc) =>
                        handleStartAnalysis(file, mode, textDesc ?? '')
                      }
                      isProcessing={false}
                    />
                    {/* Sample specimens */}
                    <SampleSpecimenGrid onSelectSample={handleSelectSample} />
                  </div>
                )}

                {/* Phase: Generating */}
                {state.phase === 'generating' && (
                  <div className="animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                      <div className="lg:col-span-3">
                        <div className="text-center mb-6">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-dim border border-violet/20 mb-4 orb-float">
                            <Dna className="w-7 h-7 text-violet" />
                            <div className="absolute inset-0 rounded-full bg-violet-glow blur-xl animate-pulse-glow" />
                          </div>
                          <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground mb-1 tracking-wide">
                            Genome Atlas is Creating
                          </h2>
                          <p className="text-xs text-foreground-muted max-w-sm mx-auto leading-relaxed">
                            Tracing evolutionary pathways through deep time to generate three
                            alternate futures...
                          </p>
                        </div>
                        <div className="relative max-w-md mx-auto">
                          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-pink/40 via-violet/40 to-gold/40" />
                          <div className="space-y-0">
                            {GENERATION_STORY.map((step, i) => {
                              const isActive = i === progressStep;
                              const isDone = i < progressStep;
                              const Icon = step.icon;
                              return (
                                <div key={i} className={`story-step relative flex items-start gap-4 py-4 pl-0 ${isActive ? 'active' : isDone ? 'done' : ''}`}>
                                  <div className="relative z-10 flex-shrink-0">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-pink/20 border-2 border-pink shadow-[0_0_15px_rgba(255,45,149,0.3)]' : isDone ? 'bg-violet-dim border border-violet/30' : 'bg-surface-elevated border border-white/5'}`}>
                                      {isDone ? <Check className="w-4 h-4 text-violet" /> : <Icon className={`w-4 h-4 ${isActive ? 'text-pink' : 'text-foreground-muted/40'}`} />}
                                    </div>
                                    {isActive && <div className="absolute -inset-1.5 rounded-full border-2 border-pink/30 pulse-ring" />}
                                  </div>
                                  <div className="flex-1 pt-2.5">
                                    <p className={`text-sm font-medium transition-colors duration-500 ${isActive ? 'text-foreground' : isDone ? 'text-foreground-muted' : 'text-foreground-muted/30'}`}>{step.label}</p>
                                    <p className={`text-[10px] mt-0.5 transition-all duration-500 ${isActive ? 'text-foreground-muted/70 max-h-5' : 'max-h-0 overflow-hidden opacity-0'}`}>{step.sub}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex justify-center mt-6">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-pink animate-spin" />
                            <span className="text-[10px] text-foreground-muted animate-pulse-glow">Generating evolutionary possibilities...</span>
                          </div>
                        </div>
                      </div>
                      <div className="lg:col-span-2 space-y-4">
                        <div className="p-4 rounded-xl bg-surface/60 border border-border">
                          <h4 className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider mb-3">Specimen Input</h4>
                          {state.mode === 'photo' && state.file && (
                            <div className="relative rounded-lg overflow-hidden border border-white/5">
                              <img src={URL.createObjectURL(state.file)} alt="Uploaded specimen" className="w-full h-40 object-cover"
                                onLoad={(e) => { const src = (e.target as HTMLImageElement).src; if (src.startsWith('blob:')) setTimeout(() => URL.revokeObjectURL(src), 5000); }} />
                              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                                <span className="text-[9px] text-white/60 truncate">{state.file.name}</span>
                              </div>
                            </div>
                          )}
                          {state.mode === 'video' && state.file && (
                            <div className="relative rounded-lg overflow-hidden border border-white/5 bg-black/40">
                              <video src={URL.createObjectURL(state.file)} className="w-full h-40 object-cover" />
                              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                                <span className="text-[9px] text-white/60 truncate">{state.file.name}</span>
                              </div>
                            </div>
                          )}
                          {state.mode === 'audio' && state.file && (
                            <div className="flex flex-col items-center justify-center h-32 rounded-lg bg-surface-elevated border border-white/5">
                              <Mic className="w-8 h-8 text-pink mb-2" />
                              <p className="text-[10px] text-foreground-muted mb-1">Voice Note</p>
                              <span className="text-[9px] text-foreground-muted/40">{state.file.name}</span>
                            </div>
                          )}
                          {state.mode === 'text' && state.textDesc && (
                            <div className="p-3 rounded-lg bg-surface-elevated border border-white/5">
                              <div className="flex items-center gap-1.5 mb-2">
                                <Send className="w-3 h-3 text-foreground-muted" />
                                <span className="text-[9px] text-foreground-muted uppercase tracking-wider">Description</span>
                              </div>
                              <p className="text-[11px] text-foreground/80 leading-relaxed line-clamp-6">{state.textDesc}</p>
                            </div>
                          )}
                        </div>
                        <div className="p-4 rounded-xl bg-surface/60 border border-border">
                          <h4 className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider mb-3">Processing Info</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-foreground-muted">Mode</span>
                              <span className="text-foreground font-medium capitalize">{INPUT_MODE_LABELS[state.mode] ?? state.mode}</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                              <span className="text-foreground-muted">Status</span>
                              <span className="text-pink font-medium">Analyzing...</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                              <span className="text-foreground-muted">Engine</span>
                              <span className="text-foreground font-medium">Gemini 2.0</span>
                            </div>
                          </div>
                          <div className="mt-3 h-1 rounded-full bg-surface-elevated overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-pink via-violet to-gold transition-all duration-700" style={{ width: `${Math.round(((progressStep + 1) / GENERATION_STORY.length) * 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Phase: Choose */}
                {state.phase === 'choose' && (
                  <div className="animate-fade-in">
                    <ResultView result={state.result} selectedIndex={selectedIndex} onSelect={handleSelect} onReset={handleReset} />
                  </div>
                )}

                {/* Phase: Cube with Pollinations image */}
                {state.phase === 'cube' && (
                  <div className="animate-fade-in">
                    <NarrationPlayer
                      title={state.selectedOption.title}
                      type={state.selectedOption.type}
                      description={state.selectedOption.description}
                      scientificDetail={state.selectedOption.scientificDetail}
                      imageUrl={state.selectedOption.imageUrl || (state.selectedOption.imagePrompt ? getSpecimenImageUrl(state.selectedOption.imagePrompt).url : undefined)}
                      speciesName={state.speciesName}
                      onReset={handleReset}
                    />
                  </div>
                )}

                {/* Phase: Error */}
                {state.phase === 'error' && (
                  <div className="max-w-lg mx-auto mt-4 animate-fade-in">
                    <div className="p-6 rounded-xl bg-gradient-to-b from-destructive/10 to-transparent border border-destructive/20">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <span className="text-xs font-semibold text-destructive">Analysis Failed</span>
                      </div>
                      <p className="text-xs text-foreground-muted mb-4">{state.message}</p>
                      <div className="flex items-center gap-2">
                        <button onClick={handleRetry} className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink to-violet text-white text-xs font-semibold hover:opacity-90 transition-all duration-200 active:scale-[0.97]">Retry Analysis</button>
                        <button onClick={handleReset} className="px-4 py-2 rounded-lg border border-border text-xs text-foreground-muted hover:text-foreground transition-all duration-200">Start Over</button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ===== SIDEBAR VIEWS ===== */}
            {currentView === 'workspace' && (
              <div className="max-w-4xl mx-auto pt-4 animate-fade-in text-center">
                <LayoutDashboard className="w-10 h-10 text-violet mx-auto mb-3" />
                <h2 className="text-lg font-heading font-bold text-foreground mb-1">Workspace</h2>
                <p className="text-xs text-foreground-muted mb-6">Your recent analyses and saved projects will appear here.</p>
                <button onClick={() => navigateTo('workflow')} className="px-4 py-2 rounded-lg bg-violet/10 border border-violet/20 text-xs text-violet hover:bg-violet/20 transition-all">Start New Analysis</button>
              </div>
            )}
            {currentView === 'dino-archive' && <DinoArchiveView />}
            {currentView === 'projects' && <ProjectsView userLevel={userLevel} onStartAnalysis={() => { navigateTo('workflow'); handleReset(); }} />}
            {currentView === 'ai-tools' && <AIToolsView />}
            {currentView === 'integrations' && <IntegrationsView />}
            {currentView === 'fossil-library' && <FossilLibraryView />}
            {currentView === 'timeline' && <TimelineExplorerView />}
            {currentView === 'scanner' && <GenomeScannerView />}
            {currentView === 'compare' && <CompareSpeciesView />}
            {currentView === 'evolve' && <EvolutionSimulatorView />}
            {currentView === 'mutations' && <MutationMapView />}
            {currentView === 'history' && <HistoryView userLevel={userLevel} />}
            {currentView === 'time-machine' && <TimeMachineView userLevel={userLevel} />}
            {currentView === 'subscription' && <SubscriptionView currentLevel={userLevel} onUpgrade={handleUpgrade} />}
            {currentView === 'settings' && <SettingsView userLevel={userLevel} onLevelChange={setUserLevel} clearHistory={clearHistory} />}
            {currentView === 'profile' && <ProfileView user={user} userLevel={userLevel} onLevelChange={setUserLevel} onSignOut={handleSignOut} />}
            {currentView !== 'workflow' && currentView !== 'workspace' && currentView !== 'dino-archive' && currentView !== 'projects' && currentView !== 'ai-tools' && currentView !== 'integrations' && currentView !== 'fossil-library' && currentView !== 'timeline' && currentView !== 'scanner' && currentView !== 'compare' && currentView !== 'evolve' && currentView !== 'mutations' && currentView !== 'history' && currentView !== 'time-machine' && currentView !== 'subscription' && currentView !== 'settings' && currentView !== 'profile' && (
              <div className="max-w-2xl mx-auto pt-4 animate-fade-in text-center">
                <Sparkles className="w-10 h-10 text-violet mx-auto mb-3" />
                <h2 className="text-lg font-heading font-bold text-foreground mb-1 capitalize">{currentView.replace(/-/g, ' ')}</h2>
                <p className="text-xs text-foreground-muted mb-6">This feature is coming soon</p>
                <button onClick={() => navigateTo('workflow')} className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet to-pink text-white text-xs font-semibold hover:opacity-90 transition-all active:scale-[0.97]">Analyze a Species</button>
              </div>
            )}
          </main>

          {/* ===== CHAT PANEL ===== */}
          {chatOpen && (
            <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-surface/60 backdrop-blur-sm flex flex-col animate-fade-in shrink-0">
              <div className="flex items-center justify-between px-4 h-12 border-b border-border">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-pink" />
                  <span className="text-xs font-semibold text-foreground">Evolutionary Assistant</span>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-all"
                >
                  X
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatMessages.length === 0 && (
                  <div className="text-center py-8">
                    <Sparkles className="w-6 h-6 text-foreground-muted/30 mx-auto mb-2" />
                    <p className="text-[11px] text-foreground-muted leading-relaxed">
                      Ask me about evolution, genetics, or this specimen's possible future paths.
                    </p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-lg text-[11px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-pink/10 border border-pink/20 text-foreground'
                        : 'bg-surface-elevated border border-border text-foreground-muted'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-border">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleChatSend(); }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about evolution..."
                    className="flex-1 bg-surface-elevated border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-foreground-muted/40 outline-none focus:border-pink/40 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="p-2 rounded-lg bg-pink text-white disabled:opacity-30 hover:opacity-90 transition-all active:scale-[0.97]"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </aside>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <footer className="border-t border-border bg-surface/20 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-7 h-7 rounded-lg bg-pink-dim border border-pink/20 flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5 text-pink" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-0.5">Quantum Analysis</p>
                  <p className="text-[10px] text-foreground-muted leading-relaxed">
                    Radiation-induced mutation &amp; quantum tunneling pathways
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-7 h-7 rounded-lg bg-gold-dim border border-gold/20 flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5 text-gold" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-0.5">Natural Selection</p>
                  <p className="text-[10px] text-foreground-muted leading-relaxed">
                    Classic evolutionary pressures &amp; adaptive radiation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-7 h-7 rounded-lg bg-violet-dim border border-violet/20 flex items-center justify-center shrink-0">
                  <InfinityIcon className="w-3.5 h-3.5 text-violet" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-0.5">Deep Time</p>
                  <p className="text-[10px] text-foreground-muted leading-relaxed">
                    Million-year projections across alternate timelines
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
              <p className="text-[10px] text-foreground-muted">
                Genome Atlas AI &mdash; Evolution Time Machine · {LEVELS[userLevel].icon} {LEVELS[userLevel].label}
              </p>
              <p className="text-[10px] text-foreground-muted/60">v2.0</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/** Convert a File to a base64 data URL (stripping the prefix). */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] ?? result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}