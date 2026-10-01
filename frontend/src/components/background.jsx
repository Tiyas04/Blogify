import React from 'react';

const Background = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none select-none newsprint-paper-canvas"
      aria-hidden="true"
    >
      {/* 1. Tactile Wood Pulp Paper Fiber Flecks Texture */}
      <div className="absolute inset-0 w-full h-full newsprint-fibers-pattern opacity-90 pointer-events-none" />

      {/* 2. Classic Horizontal Broadsheet Crease Fold ("Above the fold" fold) */}
      <div className="absolute inset-0 w-full h-full newspaper-broadsheet-fold pointer-events-none" />

      {/* 3. Broadsheet Vertical Newspaper Column Guide Rules & Baseline Typesetting */}
      <div className="absolute inset-0 w-full h-full newspaper-column-grid opacity-80 pointer-events-none" />

      {/* 4. Top Broadsheet Masthead Watermark Header (Faded elegant newspaper header) */}
      <header className="absolute top-22 inset-x-0 pt-1 pb-3 px-6 hidden sm:block opacity-45 dark:opacity-30 border-b border-border-base">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Top ear and dateline */}
          <div className="w-full flex justify-between items-center text-[10px] font-brand tracking-[0.25em] uppercase text-text-muted pb-1.5 border-b border-border-base/70">
            <span className="font-semibold">Vol. CXXXVIII · No. 54,210</span>
            <span className="font-bold tracking-[0.35em] text-text-primary/70">✦ The Classic Broadsheet Edition ✦</span>
            <span>Late City · Price Two Cents</span>
          </div>

          {/* Central Newspaper Masthead Title */}
          <div className="py-1.5 text-center">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-black tracking-[0.22em] uppercase text-text-primary">
              The Daily Blogify Gazette
            </h2>
            <p className="font-serif italic text-xs tracking-widest text-text-muted mt-0.5">
              “Veritas in Litteris — All the Thoughtful Cogitations, Essays & Dispatches Fit to Print”
            </p>
          </div>

          {/* Double rule with center fleuron */}
          <div className="w-full flex items-center gap-4 pt-1.5 border-t-2 border-b border-border-base/80 text-[11px] text-text-muted justify-center">
            <span className="h-px bg-border-base grow max-w-sm" />
            <span className="font-serif tracking-widest text-sm">❦ · ❖ · ❧</span>
            <span className="h-px bg-border-base grow max-w-sm" />
          </div>
        </div>
      </header>

      {/* 5. Authentic Newspaper Broadsheet Clippings in the Margins */}

      {/* --- Article Clipping 1 (Top Left Editorial Column) --- */}
      <article className="absolute top-44 -left-8 lg:left-4 xl:left-10 w-72 lg:w-80 p-5 rounded-sm bg-bg-surface/30 backdrop-blur-[1px] border border-border-base/50 shadow-xs opacity-35 dark:opacity-20 animate-news-drift-1 hidden md:block">
        <div className="border-b border-border-base/60 pb-1.5 mb-2 flex justify-between items-center text-[9px] font-brand uppercase tracking-wider text-text-muted">
          <span className="font-bold">Editorial Column</span>
          <span>Folio VIII</span>
        </div>
        <h3 className="font-serif text-sm font-bold leading-snug tracking-tight text-text-primary uppercase mb-1.5">
          On the Art of Reasoned Prose & Intellectual Solitude
        </h3>
        <p className="text-[10px] font-brand uppercase tracking-widest text-text-muted mb-2 italic">
          London Bureau — By Our Senior Correspondent
        </p>
        <p className="font-serif text-[11px] leading-relaxed text-text-secondary text-justify newspaper-dropcap">
          In an era characterized by the restless acceleration of discourse, the deliberate discipline of the written page maintains its quiet nobility. The discerning reader does not seek ephemeral declarations, but the enduring clarity that blooms from disciplined thought.
        </p>
        <div className="mt-3 pt-2 border-t border-dotted border-border-base flex justify-center text-text-muted text-[11px]">
          ❖ ——— ❖ ——— ❖
        </div>
      </article>

      {/* --- Article Clipping 2 (Top Right Dispatch & Press Stamp) --- */}
      <article className="absolute top-52 -right-8 lg:right-4 xl:right-10 w-72 lg:w-84 p-5 rounded-sm bg-bg-surface/30 backdrop-blur-[1px] border border-border-base/50 shadow-xs opacity-35 dark:opacity-20 animate-news-drift-2 hidden md:block">
        <div className="flex justify-between items-start mb-2">
          <div className="text-[9px] font-brand uppercase tracking-wider text-text-muted border-b border-border-base/60 pb-1 font-semibold">
            Dispatch · No. 418
          </div>
          <span className="newspaper-stamp">
            Verified Press Copy
          </span>
        </div>
        <h3 className="font-serif text-sm font-bold leading-snug tracking-tight text-text-primary uppercase mb-1.5">
          The Architecture of Digital Craft & Curious Minds
        </h3>
        <p className="text-[10px] font-brand uppercase tracking-widest text-text-muted mb-2 italic">
          New York, Oct. 1 — Special Cablegram
        </p>
        <p className="font-serif text-[11px] leading-relaxed text-text-secondary text-justify newspaper-dropcap">
          When inquisitive minds convene upon primary principles, unexpected transformations occur. Correspondents from literary circles observe that meticulous craft and earnest curiosity remain humanity's most resilient instruments against transient noise.
        </p>
        <div className="mt-2 text-[9px] font-brand text-text-muted flex justify-between items-center border-t border-border-base/50 pt-1.5">
          <span>Weather: Crisp, Brisk Winds</span>
          <span>Barometer: 30.14</span>
        </div>
      </article>

      {/* --- Article Clipping 3 (Mid-Lower Left / Critic's Digest) --- */}
      <article className="absolute top-[65%] -left-8 lg:left-4 xl:left-10 w-68 lg:w-76 p-4 rounded-sm bg-bg-surface/25 backdrop-blur-[1px] border border-border-base/40 opacity-30 dark:opacity-15 animate-news-drift-3 hidden lg:block">
        <div className="flex justify-between items-center border-b border-border-base/50 pb-1 mb-2">
          <span className="text-[8px] font-brand uppercase tracking-widest text-text-muted font-bold">The Critic’s Portfolio</span>
          <span className="text-[8px] font-serif italic text-text-muted">Section C · Page 4</span>
        </div>
        <h4 className="font-serif text-xs font-bold uppercase text-text-primary mb-1">
          Chronicles of Craft & Mind
        </h4>
        <p className="font-serif text-[10.5px] leading-relaxed text-text-secondary text-justify">
          “To articulate an idea with fidelity is to offer hospitality to the reader’s intellect. The essay outlasts the hour in which it was conceived.”
        </p>
        <div className="mt-3 flex items-center justify-between text-[9px] text-text-muted border-t border-border-base/40 pt-1">
          <span>Registry 2026 // Archive</span>
          <div className="newspaper-stamp-round w-9 h-9 text-[7px] leading-tight font-bold">
            PRESS<br/>ARCHIVE
          </div>
        </div>
      </article>

      {/* --- Article Clipping 4 (Lower Right / Classifieds & Broadsheet Colophon) --- */}
      <article className="absolute top-[70%] -right-8 lg:right-4 xl:right-12 w-68 lg:w-76 p-4 rounded-sm bg-bg-surface/25 backdrop-blur-[1px] border border-border-base/40 opacity-30 dark:opacity-15 animate-news-drift-1 hidden lg:block">
        <div className="border-b border-border-base/50 pb-1 mb-2 text-[8px] font-brand uppercase tracking-widest text-text-muted flex justify-between font-bold">
          <span>Broadsheet Colophon</span>
          <span>Est. 2026</span>
        </div>
        <h4 className="font-serif text-xs font-bold uppercase text-text-primary mb-1">
          Gazetteer & Press Notices
        </h4>
        <p className="font-serif text-[10px] leading-relaxed text-text-secondary text-justify">
          Printed upon authentic acid-free digital newsprint vellum. Set in classic editorial letterforms. Published daily for curious minds worldwide.
        </p>
        <div className="mt-2 pt-1 border-t border-border-base/40 flex justify-between text-[8px] font-brand tracking-widest text-text-muted uppercase">
          <span>ISSN 1045-8930</span>
          <span>Circulation 48,000</span>
        </div>
      </article>

      {/* 6. Giant Subtle Watermark Serif Lettering (Faint Background Layer) */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[12vw] font-black uppercase tracking-[0.25em] text-text-primary/[0.02] pointer-events-none select-none whitespace-nowrap overflow-hidden z-[-1]"
      >
        CHRONICLE
      </div>
      <div 
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 font-serif text-[10vw] font-black uppercase tracking-[0.2em] text-text-primary/[0.018] pointer-events-none select-none whitespace-nowrap overflow-hidden z-[-1]"
      >
        EDITORIAL
      </div>

      {/* 7. Vintage Newsprint Halftone Screen Accents in Corners */}
      <div className="absolute top-28 left-4 w-36 h-36 newspaper-halftone opacity-20 rounded-full blur-[0.5px] pointer-events-none" />
      <div className="absolute bottom-28 right-8 w-44 h-44 newspaper-halftone opacity-18 rounded-full blur-[0.5px] pointer-events-none" />
    </div>
  );
};

export default Background;
