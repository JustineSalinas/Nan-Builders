/**
 * Shown while a route segment streams in.
 *
 * Deliberately not a spinner and not a skeleton of the page: most of this site
 * is static and appears almost instantly, so an elaborate placeholder would
 * flash and be gone — which reads as jank, not speed. A quiet band in the same
 * navy the page is about to open with means the transition never flashes white.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="min-h-[60vh] bg-brand-navy-900"
    >
      <div className="container-x py-24">
        <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
        <div className="mt-6 h-10 w-full max-w-2xl animate-pulse rounded-lg bg-white/10" />
        <div className="mt-3 h-10 w-2/3 max-w-lg animate-pulse rounded-lg bg-white/[0.07]" />
      </div>
    </div>
  );
}
