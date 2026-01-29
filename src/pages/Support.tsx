import { useState, useMemo } from "react";
import { Search, MessageCircle, Mail, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { FAQAccordion } from "@/components/support/FAQAccordion";
import { useI18n } from "@/contexts/I18nContext";
import { faqItems, faqCategories } from "@/data/faq";
import { analytics } from "@/utils/analytics";
import { useEffect } from "react";

const Support = () => {
  const { t, language } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    analytics.track('support_viewed');
  }, []);

  const categories = Object.entries(faqCategories).map(([key, value]) => ({
    id: key,
    name: value[language],
    count: faqItems.filter(item => item.category === key).length
  }));

  const filteredItems = useMemo(() => {
    return faqItems.filter(item => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const title = language === 'en' ? item.title_en : item.title_es;
      const body = language === 'en' ? item.body_en : item.body_es;
      const matchesSearch = !searchTerm ||
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        body.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, language]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      analytics.track('support_search_used', { query: value });
    }
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? "" : categoryId);
    analytics.track('support_category_opened', { category: categoryId });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            {t('support.title')}
          </h1>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('support.search_placeholder')}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
              aria-label="Buscar en FAQ"
            />
          </div>

          {/* Active filters */}
          {(searchTerm || selectedCategory) && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">
                {filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-primary hover:text-primary/80"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categorías</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedCategory === category.id
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'hover:bg-muted border-transparent'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <FAQAccordion
              items={filteredItems}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 p-8 bg-muted/50 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">
            {t('support.contact_title')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('support.contact_description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                analytics.track('support_cta_submit_clicked', { source: 'contact_section' });
                window.location.href = '/support/submit';
              }}
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              {t('support.open_ticket')}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                analytics.track('support_email_clicked');
                window.location.href = 'mailto:info@livix.es';
              }}
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              {t('support.email_us')}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                analytics.track('support_guide_clicked');
                window.location.href = '/erasmus/guide';
              }}
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              {t('support.erasmus_guide')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Support;