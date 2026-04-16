// components/loader/SkeletonTable.jsx
import Skeleton from "@/components/loader/Skeleton";

const widths = ["w-12", "w-16", "w-20", "w-24", "w-28", "w-32"];

export default function SkeletonTable({ rows = 5, cols = 6 }) {
  return (
    <div className="px-6 pb-6">
      {/* Header Skeleton */}
      <div
        className="grid gap-4 px-2 pb-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={`h-${i}`}
            className={`h-3 ${widths[i % widths.length]} ${
              i === cols - 1 ? "justify-self-end" : ""
            }`}
          />
        ))}
      </div>
      <div className="border-t border-gray-200" />

      {/* Row Skeletons */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={`r-${rowIdx}`}
          className="grid items-center gap-4 border-b border-gray-100 px-2 py-4"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((__, colIdx) => (
            <Skeleton
              key={`c-${rowIdx}-${colIdx}`}
              className={`${
                colIdx === cols - 1 ? "justify-self-end" : ""
              } h-4 ${widths[(colIdx + rowIdx) % widths.length]}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
