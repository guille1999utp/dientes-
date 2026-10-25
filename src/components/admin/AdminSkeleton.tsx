export function AdminSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="h-10 w-64 animate-pulse rounded-2xl bg-white" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-3xl bg-white" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-3xl bg-white" />
    </div>
  );
}
