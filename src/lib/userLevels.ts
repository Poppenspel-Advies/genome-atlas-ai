/**
 * User level system — Beginner, Researcher, Scientist.
 * Each level has different guidance prompts, features, and subscription requirements.
 */

export type UserLevel = 'beginner' | 'researcher' | 'scientist';

export interface LevelInfo {
  id: UserLevel;
  label: string;
  description: string;
  icon: string; // emoji used as icon
  color: string; // Tailwind color class
  features: string[];
  analysisCredits: number; // per month
  subscriptionRequired: boolean;
  price: string;
}

export const LEVELS: Record<UserLevel, LevelInfo> = {
  beginner: {
    id: 'beginner',
    label: 'Beginner Explorer',
    description: 'Perfect for students and curious minds starting their evolutionary journey.',
    icon: '🌱',
    color: 'text-emerald-400',
    features: [
      '5 analyses per month',
      'Guided explanations (simplified)',
      'Sample specimens included',
      'Basic evolutionary outcomes',
      'Community access',
    ],
    analysisCredits: 5,
    subscriptionRequired: false,
    price: 'Free',
  },
  researcher: {
    id: 'researcher',
    label: 'Researcher',
    description: 'For biology enthusiasts, educators, and field researchers needing deeper analysis.',
    icon: '🔬',
    color: 'text-violet',
    features: [
      '50 analyses per month',
      'Detailed scientific data',
      'Comparative species tools',
      'Genome Scanner access',
      'Export reports (PDF)',
      'Priority AI Chat with expert guidance',
      'Weekly evolution reports',
    ],
    analysisCredits: 50,
    subscriptionRequired: true,
    price: '$12/mo',
  },
  scientist: {
    id: 'scientist',
    label: 'Scientist',
    description: 'Maximum power for professional researchers, geneticists, and evolutionary biologists.',
    icon: '🧬',
    color: 'text-gold',
    features: [
      'Unlimited analyses',
      'Full raw data export',
      'Advanced genome scanning',
      'Quantum pathway simulations',
      'Custom model parameters',
      'Priority 24/7 AI Chat',
      'Weekly + custom reports',
      'Time Machine projections archive',
      'API access for integration',
    ],
    analysisCredits: Infinity,
    subscriptionRequired: true,
    price: '$29/mo',
  },
};

/** Get guidance message for a specific user level and context. */
export function getLevelGuidance(level: UserLevel, context: 'analysis' | 'choose' | 'time-machine' | 'chat' | 'report'): string {
  const guides: Record<UserLevel, Record<string, string>> = {
    beginner: {
      analysis: "🌱 **Beginner Tip:** You're analyzing a biological specimen! The AI will identify it and show two possible futures. Don't worry about the science — just observe and learn. Each outcome has a simple explanation.",
      choose: "🌱 **Your Choice:** Pick the path that sounds most interesting to you! Both are scientifically valid. The 'Quantum' path explores radiation and mutation, while 'Natural Selection' follows classic evolution.",
      'time-machine': "🌱 **Time Machine:** You're looking at a possible future for this species! Hover over the cube to pause it and read each face. Try the narration to hear the story.",
      chat: "🌱 **Ask Anything!** I'm here to explain evolution in simple terms. Try: 'Why do species evolve?' or 'What makes this outcome different?'",
      report: "🌱 **Weekly Summary:** Here's what you explored this week. Each analysis helps you understand evolution better. Keep exploring!",
    },
    researcher: {
      analysis: "🔬 **Research Mode:** Specimen identified. The AI is running phylogenetic analysis with comparative genomics markers. Review both outcomes for experimental hypothesis generation.",
      choose: "🔬 **Data-Driven Choice:** Consider the epigenetic factors at play. Quantum pathways may reveal cryptic variation, while natural selection shows adaptive pressure. Document your rationale for peer review.",
      'time-machine': "🔬 **Time Cube:** Rotate through all six dimensions. The scientific detail face contains SNP-level data. Export this analysis for your research notes.",
      chat: "🔬 **Research Query:** I can discuss allele frequency shifts, selection coefficients, and genetic drift. Reference specific papers or request statistical models.",
      report: "🔬 **Research Report:** Weekly analysis digest with comparative metrics. Includes species diversity index, pathway preference scoring, and suggested follow-up studies.",
    },
    scientist: {
      analysis: "🧬 **Full Access:** Running multi-model ensemble analysis with Bayesian inference. Specimen genome mapped against NCBI reference database. Quantum entanglement pathways modeled at molecular resolution.",
      choose: "🧬 **Advanced Selection:** Review both outcomes with full parameter visibility. Quantum path: radiation flux, epigenetic drift, transposon activation. Natural path: fitness landscapes, Hardy-Weinberg equilibrium shifts, selective sweeps.",
      'time-machine': "🧬 **6D Projection Complete:** All phenotypic and genotypic dimensions rendered. Raw mutation rate data available. Custom simulation parameters can be adjusted for sensitivity analysis.",
      chat: "🧬 **Scientific Interface:** Access to raw model weights, pathway probabilities, and Monte Carlo simulations. Request specific hypothesis testing or comparative phylogenomic analysis.",
      report: "🧬 **Comprehensive Report:** Full weekly dataset including allelic frequency trajectories, mutation accumulation rates, and projected speciation timelines. Raw JSON export available.",
    },
  };

  return guides[level]?.[context] ?? `Explore your analysis to learn more about evolution.`;
}

/** Get the default level for new users. */
export function getDefaultLevel(): UserLevel {
  return 'beginner';
}

/** Check if a feature is available for a given level. */
export function isFeatureAvailable(level: UserLevel, feature: string): boolean {
  const levelInfo = LEVELS[level];
  return levelInfo.features.some((f) => f.toLowerCase().includes(feature.toLowerCase()));
}

/** Get upgrade path description */
export function getUpgradePrompt(currentLevel: UserLevel): string {
  if (currentLevel === 'beginner') {
    return 'Upgrade to **Researcher** ($12/mo) for 50 analyses/month, detailed scientific data, and comparative tools.';
  }
  if (currentLevel === 'researcher') {
    return 'Upgrade to **Scientist** ($29/mo) for unlimited analyses, genome scanning, and API access.';
  }
  return 'You\'re on the top tier — enjoy full access!';
}