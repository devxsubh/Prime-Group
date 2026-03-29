/** Immediate UI while the next route’s server components load (perceived faster nav). */
export default function RootSegmentLoading() {
  return (
    <div
      className="min-h-[50vh] w-full flex items-center justify-center gap-2 px-4"
      style={{ backgroundColor: "var(--pure-white)" }}
      aria-busy="true"
      aria-label="Loading page"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block h-2 w-2 rounded-full bg-[#003366]/30 motion-reduce:animate-none animate-pulse"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </div>
  );
}
