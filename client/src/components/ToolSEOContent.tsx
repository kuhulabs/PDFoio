import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Info, 
  Lightbulb, 
  HelpCircle, 
  Link as LinkIcon,
  ArrowRight 
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Link } from "wouter";

interface ToolSEOContentProps {
  pageTitle?: string;
  intro?: string;
  howItWorks?: string[];
  benefits?: string[];
  faqs?: { question: string; answer: string }[];
  relatedTools?: { name: string; path: string; description?: string }[];
}

export const ToolSEOContent = memo(function ToolSEOContent({
  pageTitle,
  intro,
  howItWorks,
  benefits,
  faqs,
  relatedTools,
}: ToolSEOContentProps) {
  // Early return if no content
  const hasContent = Boolean(
    intro ||
    howItWorks?.length ||
    benefits?.length ||
    faqs?.length ||
    relatedTools?.length
  );

  if (!hasContent) return null;

  return (
    <article className="mt-16 space-y-12 max-w-4xl mx-auto px-4 pb-20">
      {/* Hidden H1 for SEO */}
      {pageTitle && (
        <h1 className="sr-only">{pageTitle}</h1>
      )}

      {/* Introduction */}
      {intro && (
        <section className="space-y-4">
          <header className="flex items-center gap-2 text-primary">
            <Info className="h-6 w-6" aria-hidden="true" />
            <h2 className="text-2xl font-bold">About this Tool</h2>
          </header>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {intro}
          </p>
        </section>
      )}

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* How it Works */}
        {howItWorks && howItWorks.length > 0 && (
          <section className="space-y-4">
            <header className="flex items-center gap-2 text-primary">
              <Lightbulb className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-2xl font-bold">How it Works</h2>
            </header>
            <Card className="border-none shadow-sm bg-muted/50">
              <CardContent className="pt-6">
                <ol className="space-y-4" role="list">
                  {howItWorks.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span 
                        className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold"
                        aria-label={`Step ${index + 1}`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Benefits */}
        {benefits && benefits.length > 0 && (
          <section className="space-y-4">
            <header className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-2xl font-bold">Benefits</h2>
            </header>
            <Card className="border-none shadow-sm bg-muted/50">
              <CardContent className="pt-6">
                <ul className="space-y-4" role="list">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex gap-3">
                      <CheckCircle2 
                        className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" 
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      {/* FAQs with Schema.org markup */}
      {faqs && faqs.length > 0 && (
        <section 
          className="space-y-4"
          itemScope 
          itemType="https://schema.org/FAQPage"
        >
          <header className="flex items-center gap-2 text-primary">
            <HelpCircle className="h-6 w-6" aria-hidden="true" />
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          </header>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <AccordionTrigger 
                  className="text-left hover:no-underline"
                  itemProp="name"
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <div 
                    className="text-muted-foreground leading-relaxed"
                    itemProp="text"
                  >
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools && relatedTools.length > 0 && (
        <section className="space-y-6 pt-8 border-t">
          <header className="flex items-center gap-2 text-primary">
            <LinkIcon className="h-6 w-6" aria-hidden="true" />
            <h2 className="text-2xl font-bold">Related PDF Tools</h2>
          </header>
          <nav aria-label="Related tools">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
              {relatedTools.map((tool, index) => (
                <li key={index}>
                  <Link
                    href={tool.path}
                    className="block no-underline group"
                  >
                    <Card className="hover-elevate cursor-pointer border-none shadow-sm bg-muted/50 transition-all hover:bg-muted hover:shadow-md">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {tool.name}
                          </span>
                          {tool.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {tool.description}
                            </p>
                          )}
                        </div>
                        <ArrowRight
                          className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-hidden="true"
                        />
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      )}
    </article>
  );
});