/** Figma's Sources chevron, tinted by the surrounding text colour. */
export function SourceChevron({ className = "" }: { className?: string }) {
  return <span className={`inline-block h-[9px] w-[13px] shrink-0 bg-current align-middle mask-[url('/figma/sources-chevron.svg')] mask-size-[100%_100%] mask-center mask-no-repeat ${className}`} aria-hidden="true" />;
}
