"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileTextIcon, SparklesIcon, WheatIcon } from "lucide-react";
import { RichTextContent } from "./rich-text-content";

function stripHtml(html: string, maxLength = 80): string {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

type AccordionSectionProps = {
  value: string;
  title: string;
  html: string;
  icon: React.ReactNode;
};

function AccordionSection({ value, title, html, icon }: AccordionSectionProps) {
  const teaser = stripHtml(html);

  return (
    <AccordionItem value={value} className="border-border min-w-0 px-3 sm:px-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex min-w-0 flex-1 items-start gap-3 py-2 text-left">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
            {icon}
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="font-semibold text-sm">{title}</p>
            {teaser && (
              <p className="text-muted-foreground mt-0.5 line-clamp-2 wrap-break-word text-xs">
                {teaser}
              </p>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="min-w-0 overflow-x-auto pl-10 pr-2 pb-2 sm:pl-12">
          <RichTextContent html={html} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

type ProductDetailAccordionProps = {
  description?: string;
  nutrients?: string;
  benefits?: string;
};

export function ProductDetailAccordion({
  description,
  nutrients,
  benefits,
}: ProductDetailAccordionProps) {
  const hasContent = description || nutrients || benefits;
  if (!hasContent) return null;

  return (
    <div className="mt-6 min-w-0">
      <Accordion type="multiple" defaultValue={[]} className="w-full min-w-0">
        {description && (
          <AccordionSection
            value="description"
            title="Product Description"
            html={description}
            icon={<FileTextIcon className="text-muted-foreground size-4" />}
          />
        )}
        {nutrients && (
          <AccordionSection
            value="nutrients"
            title="Nutrients"
            html={nutrients}
            icon={<WheatIcon className="text-muted-foreground size-4" />}
          />
        )}
        {benefits && (
          <AccordionSection
            value="benefits"
            title="Benefits"
            html={benefits}
            icon={<SparklesIcon className="text-muted-foreground size-4" />}
          />
        )}
      </Accordion>
    </div>
  );
}
