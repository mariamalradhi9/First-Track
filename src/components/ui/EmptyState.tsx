import type { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {icon && (
        <div className="w-14 h-14 rounded-full bg-field-bg text-text-3 flex items-center justify-center mb-4 [&>svg]:w-6 [&>svg]:h-6">
          {icon}
        </div>
      )}
      <p className="font-semibold text-[15px] text-text">{title}</p>
      {message && <p className="mt-1.5 text-[13.5px] text-text-2 max-w-sm">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
