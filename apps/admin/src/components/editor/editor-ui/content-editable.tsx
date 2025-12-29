import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";

type Props = {
  className?: string;
  placeholder: string;
  placeholderClassName?: string;
};

export function ContentEditable({
  className,
  placeholder,
  placeholderClassName,
}: Props): React.JSX.Element {
  return (
    <LexicalContentEditable
      aria-placeholder={placeholder}
      className={
        className ??
        `ContentEditable__root relative block min-h-72 min-h-full overflow-auto px-8 py-4 focus:outline-none`
      }
      placeholder={
        <div
          className={
            placeholderClassName ??
            `text-muted-foreground pointer-events-none absolute top-0 left-0 overflow-hidden px-8 py-[18px] text-ellipsis select-none`
          }
        >
          {placeholder}
        </div>
      }
    />
  );
}
