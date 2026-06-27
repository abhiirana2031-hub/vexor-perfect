import React from 'react';
import { SERIF } from '@/lib/design';

export default function ScrollTransitionCards() {
  return (
    <section className="max-w-5xl mx-auto py-20 px-6 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Card 1 */}
        <div className="liquid-glass rounded-2xl p-6 space-y-3 hover:bg-white/[0.03] transition-all duration-300 group">
          <h3 className="text-xl text-white font-medium italic uppercase tracking-tight leading-none group-hover:text-white transition-colors" style={SERIF}>
            Scale & Scope
          </h3>
          <p className="text-white/45 text-xs leading-relaxed font-light font-body-barlow group-hover:text-white/60 transition-colors">
            Vexor merges Svelte-speed reactivity with Astro's performance, crafting robust, scalable custom software architectures that are simple to manage.
          </p>
        </div>

        {/* Card 2 */}
        <div className="liquid-glass rounded-2xl p-6 space-y-3 hover:bg-white/[0.03] transition-all duration-300 group">
          <h3 className="text-xl text-white font-medium italic uppercase tracking-tight leading-none group-hover:text-white transition-colors" style={SERIF}>
            Custom Systems
          </h3>
          <p className="text-white/45 text-xs leading-relaxed font-light font-body-barlow group-hover:text-white/60 transition-colors">
            The web is growing increasingly complex. At our heart, Vexor offers a composable declarative approach to building secure microservices and performant database applications.
          </p>
        </div>

        {/* Card 3 */}
        <div className="liquid-glass rounded-2xl p-6 space-y-3 hover:bg-white/[0.03] transition-all duration-300 group">
          <h3 className="text-xl text-white font-medium italic uppercase tracking-tight leading-none group-hover:text-white transition-colors" style={SERIF}>
            Sovereign Deployments
          </h3>
          <p className="text-white/45 text-xs leading-relaxed font-light font-body-barlow group-hover:text-white/60 transition-colors">
            We ship with tooling for cloud infrastructure, automated telemetry, zero-downtime migrations, and complete systems monitoring, making scaling effortless.
          </p>
        </div>
      </div>
    </section>
  );
}
