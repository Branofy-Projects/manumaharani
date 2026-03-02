import { DynamicIcon } from "lucide-react/dynamic";

import type { IconName } from "lucide-react/dynamic";

export function RenderIcon({
  className,
  name,
  size = 16,
}: {
  className?: string;
  name: string;
  size?: number;
}) {
  return (
    <DynamicIcon className={className} name={name as IconName} size={size} />
  );
}
