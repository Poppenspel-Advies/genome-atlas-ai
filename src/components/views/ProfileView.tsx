import { useState, useEffect } from 'react';
import {
  User, Mail, Calendar, Shield, Dna, Activity, Clock,
  Download, LogOut, Camera,
  Edit3,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { UserLevel } from '../../lib/userLevels';
import { LEVELS } from '../../lib/userLevels';
import { getAnalysisRecords } from '../../lib/analysisStore';
import { toast } from '../../lib/toastStore';

interface ProfileViewProps {
  user: SupabaseUser | null;
  userLevel: UserLevel;
  onLevelChange: (level: UserLevel) => void;
  onSignOut: () => void;
}

export function ProfileView({ user, userLevel, onLevelChange, onSignOut }: ProfileViewProps) {
  const [analysesCount, setAnalysesCount] = useState(0);
  const [displayName, setDisplayName] = useState(() => {
    return localStorage.getItem('genomi_display_name') ?? user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Explorer';
  });
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(displayName);
  const [joinedDate] = useState(() => {
    return user?.created_at
      ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Member since March 2025';
  });

  useEffect(() => {
    setAnalysesCount(getAnalysisRecords().length);
  }, []);

  useEffect(() => {
    if (user) {
      const name = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Explorer';
      setDisplayName(name);
      setNameInput(name);
    }
  }, [user]);

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setDisplayName(trimmed);
    localStorage.setItem('genomi_display_name', trimmed);
    setEditingName(false);
    toast.success('Profile updated', 'Display name saved successfully');
  };

  const handleLevelChange = (level: UserLevel) => {
    onLevelChange(level);
    toast.info(`Switched to ${LEVELS[level].label}`, `You now have ${level === 'beginner' ? '5 analyses per month' : level === 'researcher' ? '50 analyses per month' : 'unlimited analyses'}`);
  };

  const handleExportProfileData = () => {
    const records = getAnalysisRecords();
    const data = {
      profile: {
        displayName,
        email: user?.email,
        level: userLevel,
        joinedAt: user?.created_at,
      },
      analyses: records,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genomi-profile-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported', 'Your profile data has been downloaded as JSON');
  };

  const levelInfo = LEVELS[userLevel];
  const maxCredits = levelInfo.analysisCredits === Infinity ? Infinity : levelInfo.analysisCredits;
  const creditsUsed = analysesCount % (maxCredits === Infinity ? 9999 : maxCredits);
  const creditsPercent = maxCredits === Infinity ? 50 : Math.min((creditsUsed / maxCredits) * 100, 100);

  return (
    <div className="max-w-3xl mx-auto pt-4 animate-fade-in">
      {/* Profile Header */}
      <div className="relative mb-8">
        {/* Cover photo */}
        <div className="h-32 rounded-t-xl bg-gradient-to-r from-violet/30 via-pink/20 to-gold/20 border border-border overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(139,92,246,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMEMxMy40MzEgMCAwIDEzLjQzMSAwIDMwczEzLjQzMSAzMCAzMCAzMCAzMC0xMy40MzEgMzAtMzBTNDYuNTY5IDAgMzAgMHoiIGZpbGw9InJnYmEoMTM5LDkyLDI0NiwwLjAzKSIvPjwvc3ZnPg==')] opacity-20" />
        </div>

        {/* Avatar overlay */}
        <div className="absolute -bottom-12 left-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink to-violet border-4 border-bg flex items-center justify-center text-white text-2xl font-bold shadow-xl">
              {user ? (user.email?.[0]?.toUpperCase() ?? '?') : displayName[0]?.toUpperCase() ?? '?'}
            </div>
            <button className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-surface-elevated border border-border flex items-center justify-center hover:bg-surface transition-all shadow-md" title="Change avatar">
              <Camera className="w-3.5 h-3.5 text-foreground-muted" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-14 px-2">
        <div className="flex items-start justify-between mb-6">
          <div>
            {editingName ? (
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-surface-elevated border border-violet/30 rounded-lg px-3 py-1.5 text-sm font-heading font-bold text-foreground outline-none focus:border-violet/60"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); }}
                  autoFocus
                />
                <button onClick={handleSaveName} className="px-2.5 py-1.5 rounded-lg bg-violet text-white text-[10px] font-semibold hover:opacity-90 transition-all">Save</button>
                <button onClick={() => { setEditingName(false); setNameInput(displayName); }} className="px-2.5 py-1.5 rounded-lg border border-border text-[10px] text-foreground-muted hover:text-foreground transition-all">Cancel</button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-heading font-bold text-foreground">{displayName}</h2>
                <button onClick={() => setEditingName(true)} className="p-1 rounded text-foreground-muted/30 hover:text-foreground transition-colors">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-foreground-muted">
              <Mail className="w-3 h-3" />
              <span>{user?.email ?? 'guest@genomi.ai'}</span>
              <span className="text-foreground-muted/30">·</span>
              <Calendar className="w-3 h-3" />
              <span>{joinedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleExportProfileData} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[10px] text-foreground-muted hover:text-foreground hover:border-border-glow transition-all">
              <Download className="w-3 h-3" />
              Export
            </button>
            <button onClick={onSignOut} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-[10px] text-destructive hover:bg-destructive/10 transition-all">
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-surface/60 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Dna className="w-4 h-4 text-violet" />
              <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Analyses</span>
            </div>
            <p className="text-xl font-heading font-bold text-foreground">{analysesCount}</p>
            <p className="text-[10px] text-foreground-muted/60 mt-0.5">Total specimens analyzed</p>
          </div>

          <div className="p-4 rounded-xl bg-surface/60 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-gold" />
              <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Level</span>
            </div>
            <p className="text-xl font-heading font-bold text-foreground">{levelInfo.icon} {levelInfo.label}</p>
            <p className="text-[10px] text-foreground-muted/60 mt-0.5 capitalize">{levelInfo.price === 'Free' ? 'Free tier' : levelInfo.price}</p>
          </div>

          <div className="p-4 rounded-xl bg-surface/60 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-pink" />
              <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Credits</span>
            </div>
            <p className="text-xl font-heading font-bold text-foreground">
              {maxCredits === Infinity ? '∞' : `${maxCredits - creditsUsed}`}
            </p>
            <p className="text-[10px] text-foreground-muted/60 mt-0.5">
              {maxCredits === Infinity ? 'Unlimited' : `${creditsUsed}/${maxCredits} used`}
            </p>
            {/* Progress bar */}
            {maxCredits !== Infinity && (
              <div className="mt-2 h-1 rounded-full bg-surface-elevated overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet to-pink transition-all"
                  style={{ width: `${creditsPercent}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="mb-6">
          <h3 className="text-xs font-heading font-bold text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-foreground-muted" />
            Recent Activity
          </h3>
          {analysesCount === 0 ? (
            <div className="p-6 rounded-xl bg-surface/40 border border-border text-center">
              <User className="w-8 h-8 text-foreground-muted/30 mx-auto mb-2" />
              <p className="text-xs text-foreground-muted">No recent activity. Analyze a specimen to start your evolutionary journey!</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {getAnalysisRecords().slice(0, 5).map((rec) => (
                <div key={rec.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface/40 border border-border">
                  <div className="w-7 h-7 rounded-full bg-violet-dim border border-violet/20 flex items-center justify-center">
                    <Dna className="w-3.5 h-3.5 text-violet" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{rec.speciesName}</p>
                    <p className="text-[9px] text-foreground-muted">{new Date(rec.timestamp).toLocaleDateString()} · {Math.round(rec.confidence * 100)}% confidence</p>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    rec.selectedPath === 'quantum' ? 'bg-violet-dim text-violet border border-violet/20' :
                    rec.selectedPath === 'natural-selection' ? 'bg-gold-dim text-gold border border-gold/20' :
                    'bg-surface-elevated text-foreground-muted border border-border'
                  }`}>{rec.selectedPath?.replace('-', ' ') ?? 'Pending'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Settings Summary */}
        <div className="p-4 rounded-xl bg-surface/60 border border-border">
          <h3 className="text-xs font-heading font-bold text-foreground mb-3 uppercase tracking-wider">Account Preferences</h3>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-foreground-muted">User Level</span>
              <select
                value={userLevel}
                onChange={(e) => handleLevelChange(e.target.value as UserLevel)}
                className="bg-surface-elevated border border-violet/30 rounded-lg px-2.5 py-1 text-[10px] text-foreground outline-none focus:border-violet/60"
              >
                <option value="beginner">🌱 Beginner Explorer</option>
                <option value="researcher">🔬 Researcher</option>
                <option value="scientist">🧬 Scientist</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-foreground-muted">Email Notifications</span>
              <span className="text-[10px] text-foreground">Weekly reports</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-foreground-muted">Data Privacy</span>
              <span className="text-[10px] text-emerald-400">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}