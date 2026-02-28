export function InfoPanel() {
  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-16 bg-gradient-to-br from-neutral-50 to-accent/5 dark:from-neutral-900/50 dark:to-accent/10 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800">
      <div className="max-w-sm">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Recall
        </h2>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Visual pipeline tracking, interview calendar, resume storage, and
          analytics overview — all in one place.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Visual pipeline tracking
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Interview calendar
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Resume storage
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Analytics overview
          </li>
        </ul>
      </div>
    </div>
  );
}
