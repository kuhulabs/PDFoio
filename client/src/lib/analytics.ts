// Tracks tool usage. In dev we just log to the console; in production we
// fire a Plausible custom event so we can see which tools users actually
// reach for. Plausible is loaded in client/index.html as a script tag and
// exposes window.plausible (typed in client/src/types/global.d.ts).

export const trackToolUsage = async (
  name: string,
  category: string,
  count: number,
) => {
  if (import.meta.env.DEV) {
    console.log(`Usage tracked: ${name} (${category}) - ${count} files`);
    return;
  }

  if (typeof window === "undefined") return;
  try {
    window.plausible?.("Tool Used", {
      props: { tool: name, category, files: count },
    });
  } catch {
    // Never let analytics break the user's flow.
  }
};
