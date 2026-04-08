import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Upload, Phone, Mail, MapPin, Building2, StickyNote, Calendar } from "lucide-react";
import { useCRM, CRMLead, CRM_ESTADOS, CRMEstado } from "@/hooks/useCRM";

const CRM = () => {
  const { leads, isLoading, updateEstado, addNota, importCSV } = useCRM();
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [notaText, setNotaText] = useState("");
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);

  const handleImport = async () => {
    const count = await importCSV(importText);
    if (count > 0) {
      setImportText("");
      setShowImport(false);
    }
  };

  const handleAddNota = async () => {
    if (!selectedLead || !notaText.trim()) return;
    await addNota(selectedLead.id, notaText.trim());
    setNotaText("");
    setSelectedLead(null);
  };

  const leadsByEstado = CRM_ESTADOS.reduce(
    (acc, estado) => {
      acc[estado.value] = leads.filter((l) => l.estado === estado.value);
      return acc;
    },
    {} as Record<CRMEstado, CRMLead[]>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/admin/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Panel admin
            </Button>
            <h1 className="text-2xl font-bold text-foreground mt-2">CRM Propietarios</h1>
            <p className="text-muted-foreground text-sm">{leads.length} leads en pipeline</p>
          </div>
          <Button onClick={() => setShowImport(!showImport)} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importar CSV
          </Button>
        </div>

        {/* Import panel */}
        {showImport && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Pega el contenido de <code>leads_llamar_prioridad.csv</code> aqui:
              </p>
              <Textarea
                rows={6}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="prioridad,nombre,telefono,email,num_pisos,..."
                className="font-mono text-xs mb-3"
              />
              <div className="flex gap-2">
                <Button onClick={handleImport} disabled={!importText.trim()}>
                  Importar
                </Button>
                <Button variant="ghost" onClick={() => setShowImport(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Kanban board */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Cargando...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CRM_ESTADOS.map((estado) => (
              <div key={estado.value}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={estado.color}>{estado.label}</Badge>
                  <span className="text-xs text-muted-foreground">{leadsByEstado[estado.value]?.length || 0}</span>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {(leadsByEstado[estado.value] || []).map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onChangeEstado={updateEstado}
                      onAddNota={(lead) => setSelectedLead(lead)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nota dialog */}
        <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nota para {selectedLead?.nombre}</DialogTitle>
            </DialogHeader>
            {selectedLead?.notas && (
              <div className="bg-muted/50 rounded p-3 text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">
                {selectedLead.notas}
              </div>
            )}
            <Textarea
              value={notaText}
              onChange={(e) => setNotaText(e.target.value)}
              placeholder="Anadir nota..."
              rows={3}
            />
            <Button onClick={handleAddNota} disabled={!notaText.trim()}>
              Guardar nota
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

function LeadCard({
  lead,
  onChangeEstado,
  onAddNota,
}: {
  lead: CRMLead;
  onChangeEstado: (id: string, estado: CRMEstado) => void;
  onAddNota: (lead: CRMLead) => void;
}) {
  const nextEstado = getNextEstado(lead.estado);

  return (
    <Card className="text-xs">
      <CardContent className="p-3 space-y-2">
        <div className="font-medium text-sm truncate" title={lead.nombre}>
          {lead.tipo === "agencia" && <Building2 className="inline h-3 w-3 mr-1 text-primary" />}
          {lead.nombre}
        </div>

        {lead.telefono && (
          <a href={`tel:${lead.telefono}`} className="flex items-center gap-1 text-primary hover:underline">
            <Phone className="h-3 w-3" />
            {lead.telefono}
          </a>
        )}

        {lead.email && (
          <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-muted-foreground hover:underline truncate">
            <Mail className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{lead.email}</span>
          </a>
        )}

        {lead.zona && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {lead.zona}
          </div>
        )}

        {lead.num_pisos > 1 && (
          <div className="text-muted-foreground">{lead.num_pisos} pisos</div>
        )}

        {lead.proximo_seguimiento && (
          <div className="flex items-center gap-1 text-orange-600">
            <Calendar className="h-3 w-3" />
            {new Date(lead.proximo_seguimiento).toLocaleDateString("es-ES")}
          </div>
        )}

        <div className="flex gap-1 pt-1">
          {nextEstado && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-[10px] px-2 flex-1"
              onClick={() => onChangeEstado(lead.id, nextEstado)}
            >
              → {CRM_ESTADOS.find((e) => e.value === nextEstado)?.label}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => onAddNota(lead)}
            title="Anadir nota"
          >
            <StickyNote className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getNextEstado(current: CRMEstado): CRMEstado | null {
  const flow: Record<CRMEstado, CRMEstado | null> = {
    nuevo: "contactado",
    contactado: "interesado",
    interesado: "reunion",
    reunion: "publicado",
    publicado: null,
    rechazado: null,
  };
  return flow[current];
}

export default CRM;
