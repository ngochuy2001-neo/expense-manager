// Component widget
interface WidgetProps {
  title: string;
  children: React.ReactNode;
}

export default function Widget({ title, children }: WidgetProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-md border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}
