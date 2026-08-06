import { Settings, Bell, Shield, Palette, Globe, Download, User, ChevronRight } from 'lucide-react';
import type { UserLevel } from '../../lib/userLevels';

interface SettingsViewProps {
  userLevel: UserLevel;
  onLevelChange: (level: UserLevel) => void;
  clearHistory: () => void;
}

export function SettingsView({ userLevel, onLevelChange, clearHistory }: SettingsViewProps) {
  const sections = [
    {
      title: 'Profile',
      items: [
        { icon: User, label: 'Display Name', value: 'Alex Reynolds', action: 'Edit' },
        { icon: Palette, label: 'Theme', value: 'Dark (default)', action: 'Change' },
        { icon: Globe, label: 'Language', value: 'English', action: 'Change' },
      ],
    },
    {
      title: 'Notifications',
      items: [
        { icon: Bell, label: 'Analysis Complete', value: 'Push & Email', action: 'Configure' },
        { icon: Bell, label: 'Weekly Reports', value: 'Email', action: 'Configure' },
        { icon: Bell, label: 'Product Updates', value: 'Off', action: 'Enable' },
      ],
    },
    {
      title: 'Data',
      items: [
        { icon: Shield, label: 'Export My Data', value: 'All analyses', action: 'Export' },
        { icon: Shield, label: 'Clear History', value: `${useAnalysisCount()} records`, action: 'Clear' },
        { icon: Download, label: 'Download Reports', value: 'Weekly summaries', action: 'Download' },
      ],
    },
  ];

  function useAnalysisCount(): number {
    try {
      const raw = localStorage.getItem('genomi_atlas_analyses');
      return raw ? JSON.parse(raw).length : 0;
    } catch { return 0; }
  }

  return (
    <div className="max-w-3xl mx-auto pt-4 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-dim border border-violet/20 mb-4">
          <Settings className="w-7 h-7 text-violet" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground tracking-wide mb-1">Settings</h2>
        <p className="text-xs text-foreground-muted max-w-md mx-auto">Manage your account preferences, notifications, and data.</p>
      </div>

      {/* User level selector */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-violet-dim to-pink-dim border border-violet/20 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground mb-0.5">🧪 User Level</p>
            <p className="text-[10px] text-foreground-muted">Switch between Beginner, Researcher, and Scientist modes</p>
          </div>
          <select
            value={userLevel}
            onChange={(e) => onLevelChange(e.target.value as UserLevel)}
            className="bg-surface-elevated border border-violet/30 rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-violet/60"
          >
            <option value="beginner">🌱 Beginner</option>
            <option value="researcher">🔬 Researcher</option>
            <option value="scientist">🧬 Scientist</option>
          </select>
        </div>
      </div>

      {/* Settings sections */}
      {sections.map((section, si) => (
        <div key={si} className="mb-6">
          <h3 className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider mb-2 px-1">{section.title}</h3>
          <div className="space-y-0.5">
            {section.items.map((item, ii) => (
              <div key={ii} className="flex items-center justify-between p-3 rounded-lg bg-surface/40 border border-border hover:bg-surface-elevated transition-all group">
                <div className="flex items-center gap-3">
                  <item.icon className="w-3.5 h-3.5 text-foreground-muted" />
                  <div>
                    <p className="text-xs text-foreground">{item.label}</p>
                    <p className="text-[9px] text-foreground-muted">{item.value}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (item.label === 'Clear History') {
                      clearHistory();
                      window.location.reload();
                    }
                  }}
                  className="flex items-center gap-1 text-[10px] text-foreground-muted hover:text-foreground transition-colors"
                >
                  {item.action} <ChevronRight className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Danger zone */}
      <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
        <h4 className="text-xs font-semibold text-destructive mb-2">⚠️ Danger Zone</h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-foreground-muted">Delete all account data</p>
            <p className="text-[8px] text-foreground-muted/60">This action cannot be undone</p>
          </div>
          <button className="px-3 py-1.5 rounded-lg border border-destructive/30 text-[10px] text-destructive hover:bg-destructive/10 transition-all">Delete Account</button>
        </div>
      </div>
    </div>
  );
}