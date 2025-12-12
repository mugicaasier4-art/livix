import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Download, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Plane,
  BookOpen,
  Clock,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { useErasmusChecklist } from "@/hooks/useErasmusChecklist";
import { erasmusChecklist, messageTemplates } from "@/data/erasmus-checklist";
import { analytics } from "@/utils/analytics";
import { useEffect, useState } from "react";

const ErasmusGuide = () => {
  const { 
    progress, 
    isLoading, 
    toggleItem, 
    getSectionProgress, 
    getTotalProgress 
  } = useErasmusChecklist();

  const [copiedTemplate, setCopiedTemplate] = useState<string>('');

  const copyTemplate = async (template: string, templateId: string) => {
    try {
      await navigator.clipboard.writeText(template);
      setCopiedTemplate(templateId);
      setTimeout(() => setCopiedTemplate(''), 2000);
      
      analytics.track('erasmus_template_copied', {
        template_id: templateId
      });
    } catch (error) {
      console.error('Error copying template:', error);
    }
  };

  const handleChecklistToggle = (sectionId: string, itemId: string) => {
    toggleItem(sectionId, itemId);
    analytics.track('erasmus_checklist_item_toggled', {
      section_id: sectionId,
      item_id: itemId,
      checked: !progress[sectionId]?.[itemId]
    });
  };

  const totalProgress = getTotalProgress();
  const progressPercentage = totalProgress.total > 0 
    ? Math.round((totalProgress.completed / totalProgress.total) * 100)
    : 0;

  useEffect(() => {
    analytics.track('erasmus_guide_viewed');
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-48 bg-muted rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link to="/erasmus">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Erasmus
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Plane className="w-4 h-4 mr-2" />
            Guía completa Erasmus Zaragoza 2024-25
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Tu guía paso a paso para Erasmus en Zaragoza
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas saber: desde antes de llegar hasta integrarte completamente. 
            Checklist interactivo incluido.
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Descargar PDF completo
            </Button>
            <Link to="/erasmus/housing">
              <Button variant="outline">
                Ver alojamientos
              </Button>
            </Link>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong>Aviso legal:</strong> Esta información es orientativa y puede cambiar. 
              No constituye asesoría legal. Para trámites oficiales, consulta siempre fuentes oficiales 
              o busca asesoramiento profesional.
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center col-span-1">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {progressPercentage}%
              </div>
              <div className="text-sm font-medium">Progreso total</div>
            </CardContent>
          </Card>
          {erasmusChecklist.map(section => {
            const sectionProgress = getSectionProgress(section.id);
            return (
              <Card key={section.id} className="text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {sectionProgress.completed}/{sectionProgress.total}
                  </div>
                  <div className="text-sm font-medium">{section.title}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Guide Content */}
          <div className="lg:col-span-2 space-y-8">
            {erasmusChecklist.map((section, sectionIndex) => (
              <Card key={section.id}>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {sectionIndex + 1}
                    </div>
                    {section.title}
                  </h2>
                  
                  <Accordion type="single" collapsible className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <AccordionItem key={item.id} value={`${section.id}-${item.id}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={progress[section.id]?.[item.id] || false}
                              onCheckedChange={() => handleChecklistToggle(section.id, item.id)}
                            />
                            <span className="font-medium">{item.label}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="ml-8 space-y-2">
                            {item.description && (
                              <p className="text-muted-foreground">{item.description}</p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Tu progreso
                </h3>
                
                <div className="space-y-3">
                  {erasmusChecklist.map(section => {
                    const sectionProgress = getSectionProgress(section.id);
                    return (
                      <div key={section.id} className="flex justify-between text-sm">
                        <span>{section.title}</span>
                        <span className="font-medium">
                          {sectionProgress.completed}/{sectionProgress.total}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="text-2xl font-bold text-primary">
                    {totalProgress.completed}/{totalProgress.total}
                  </div>
                  <div className="text-sm text-muted-foreground">pasos completados</div>
                </div>
              </CardContent>
            </Card>

            {/* Templates */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Plantillas útiles
                </h3>
                
                <div className="space-y-3">
                  {Object.entries(messageTemplates).map(([key, template]) => (
                    <div key={key} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-medium">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyTemplate(template, key)}
                          className="h-auto p-1"
                        >
                          {copiedTemplate === key ? (
                            <CheckCircle className="h-3 w-3 text-success" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <Textarea 
                        value={template} 
                        readOnly 
                        className="text-xs resize-none" 
                        rows={3}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="mt-16 bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              ¿Listo para encontrar tu alojamiento?
            </h2>
            <p className="text-muted-foreground mb-6">
              Usa esta guía como referencia y encuentra el alojamiento perfecto para tu Erasmus
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/erasmus/housing">
                <Button size="lg" className="px-8">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Buscar alojamientos
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8">
                <Users className="mr-2 h-5 w-5" />
                Contactar soporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ErasmusGuide;