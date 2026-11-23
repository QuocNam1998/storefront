import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The floating development button sits over the bottom-left corner on phones, on top of the cart bar.
  devIndicators: false,
  // The development server would otherwise write an AGENTS.md into the repo on every run. CLAUDE.md holds the rules.
  agentRules: false,
}

export default nextConfig
