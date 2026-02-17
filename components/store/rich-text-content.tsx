"use client";

/**
 * Renders rich text (HTML) with consistent formatting.
 * Matches the editor output for Description, Nutrients, Benefits.
 */
const RICH_TEXT_CLASSES =
  "text-foreground text-sm leading-relaxed " +
  "[&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:first:mt-0 " +
  "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2 " +
  "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 " +
  "[&_p]:mb-2 [&_p:last-child]:mb-0 " +
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ul]:space-y-1 " +
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_ol]:space-y-1 " +
  "[&_li]:mb-0.5 " +
  "[&_strong]:font-semibold [&_em]:italic [&_u]:underline [&_s]:line-through " +
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary/80 " +
  "[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2 [&_blockquote]:text-muted-foreground " +
  "[&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:text-xs " +
  "[&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs " +
  "[&_table]:w-full [&_table]:border-collapse [&_table]:my-2 " +
  "[&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:p-2 [&_th]:text-left [&_th]:font-medium " +
  "[&_td]:border [&_td]:border-border [&_td]:p-2 " +
  "[&_img]:rounded-lg [&_img]:max-w-full [&_img]:h-auto [&_img]:my-2 " +
  "[&_hr]:my-4 [&_hr]:border-border";

type RichTextContentProps = {
  html: string;
  className?: string;
};

export function RichTextContent({ html, className = "" }: RichTextContentProps) {
  return (
    <div
      className={`${RICH_TEXT_CLASSES} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
