import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/contexts/I18nContext";
import { FAQItem, faqCategories } from "@/data/faq";
import { analytics } from "@/utils/analytics";

interface FAQAccordionProps {
  items: FAQItem[];
  searchTerm: string;
  selectedCategory?: string;
}

export const FAQAccordion = ({ items, searchTerm, selectedCategory }: FAQAccordionProps) => {
  const { t, language } = useI18n();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-primary/20 text-primary rounded-sm px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const title = language === 'en' ? item.title_en : item.title_es;
    const body = language === 'en' ? item.body_en : item.body_es;
    const matchesSearch = !searchTerm || 
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      body.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  const handleFAQOpen = (itemId: string, category: string) => {
    analytics.track('support_faq_opened', { 
      faq_id: itemId, 
      category,
      search_term: searchTerm 
    });
  };

  const handleContactClick = (category: string) => {
    analytics.track('support_cta_submit_clicked', { 
      source: 'faq',
      category 
    });
  };

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          {searchTerm 
            ? t('support.no_results')
            : t('support.no_faqs')
          }
        </div>
        <Button 
          onClick={() => handleContactClick('general')}
          className="mt-4"
        >
          {t('support.contact_us')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-sm text-muted-foreground">
        {filteredItems.length} {filteredItems.length === 1 ? 'resultado' : 'resultados'}
      </div>

      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">
              {faqCategories[category as keyof typeof faqCategories]?.[language] || category}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {items.length}
            </Badge>
          </div>

          <Accordion 
            type="multiple" 
            value={openItems}
            onValueChange={setOpenItems}
            className="space-y-2"
          >
            {items.map((item) => (
              <AccordionItem 
                key={item.id} 
                value={item.id}
                className="border border-border rounded-lg px-4"
              >
                <AccordionTrigger 
                  className="hover:no-underline py-4"
                  onClick={() => handleFAQOpen(item.id, item.category)}
                >
                  <span className="text-left font-medium">
                    {highlightText(
                      language === 'en' ? item.title_en : item.title_es,
                      searchTerm
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="text-muted-foreground mb-4">
                    {highlightText(
                      language === 'en' ? item.body_en : item.body_es,
                      searchTerm
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleContactClick(item.category)}
                  >
                    {t('support.still_need_help')} <strong>{t('support.contact_us')}</strong>
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
};