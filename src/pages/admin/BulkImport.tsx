import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Upload, Eye, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ParsedListing {
  title: string;
  address: string;
  zona: string;
  price: number;
  bedrooms: number;
  property_type: string;
}

const BulkImport = () => {
  const { user } = useAuth();
  const [csvText, setCsvText] = useState("");
  const [parsed, setParsed] = useState<ParsedListing[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<{ success: number; total: number } | null>(null);

  const handleParse = () => {
    const lines = csvText.trim().split("\n").filter((l) => l.trim());
    const items = lines
      .map((line) => {
        const [title, address, zona, price, bedrooms, type] = line.split("|").map((s) => s.trim());
        return {
          title: title || "",
          address: address || "",
          zona: zona || "",
          price: parseFloat(price) || 0,
          bedrooms: parseInt(bedrooms) || 2,
          property_type: type || "apartment",
        };
      })
      .filter((item) => item.title && item.price > 0);

    setParsed(items);
    if (items.length === 0) {
      toast.error("No se encontraron datos validos. Formato: titulo|direccion|zona|precio|habitaciones|tipo");
    } else {
      toast.success(`${items.length} pisos listos para importar`);
    }
  };

  const handleImport = async () => {
    if (!user || parsed.length === 0) return;

    setImporting(true);
    setProgress(0);
    let success = 0;

    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      const { error } = await (supabase as any).from("listings").insert({
        landlord_id: user.id,
        title: item.title,
        description: "",
        address: item.address,
        neighborhood: item.zona || null,
        city: "Zaragoza",
        price: item.price,
        available_from: "2026-09-01",
        property_type: item.property_type,
        bedrooms: item.bedrooms,
        bathrooms: 1,
        is_furnished: true,
        has_wifi: true,
        has_heating: true,
        has_elevator: false,
        has_ac: false,
        has_parking: false,
        allows_pets: false,
        has_washing_machine: false,
        utilities_included: false,
        images: [],
        is_active: true,
      });
      if (!error) success++;
      setProgress(Math.round(((i + 1) / parsed.length) * 100));
    }

    setImportResult({ success, total: parsed.length });
    toast.success(`Importados ${success} de ${parsed.length} pisos`);
    setImporting(false);
  };

  const reset = () => {
    setCsvText("");
    setParsed([]);
    setProgress(0);
    setImportResult(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/admin/dashboard'}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Panel admin
            </Button>
            <h1 className="text-2xl font-bold text-foreground mt-2">Importacion masiva</h1>
            <p className="text-muted-foreground text-sm">
              Pega datos en formato CSV (separados por |). Las fotos se anaden despues.
            </p>
          </div>

          {importResult ? (
            <Card className="border-green-200">
              <CardContent className="p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Importacion completada
                </h3>
                <p className="text-muted-foreground mb-6">
                  {importResult.success} de {importResult.total} pisos importados correctamente.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={reset}>Importar mas</Button>
                  <Button variant="outline" onClick={() => window.location.href = '/admin/quick-listing'}>
                    Subir piso con fotos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Input */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Datos CSV</CardTitle>
                  <CardDescription>
                    Formato: titulo|direccion|zona|precio|habitaciones|tipo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    rows={10}
                    placeholder={`Piso 3 hab Delicias|Calle Delicias 45|Delicias|400|3|apartment\nHabitacion en Centro|Gran Via 12|Centro|280|1|room\nEstudio Actur|Calle Pablo Gargallo 8|Actur|350|1|studio`}
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Button onClick={handleParse} className="mt-4" disabled={!csvText.trim()}>
                    <Eye className="mr-2 h-4 w-4" />
                    Previsualizar ({csvText.trim().split("\n").filter(l => l.trim()).length} lineas)
                  </Button>
                </CardContent>
              </Card>

              {/* Preview table */}
              {parsed.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{parsed.length} pisos listos</CardTitle>
                    <CardDescription>Revisa antes de importar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-2">#</th>
                            <th className="text-left py-2 px-2">Titulo</th>
                            <th className="text-left py-2 px-2">Direccion</th>
                            <th className="text-left py-2 px-2">Zona</th>
                            <th className="text-right py-2 px-2">Precio</th>
                            <th className="text-center py-2 px-2">Hab</th>
                            <th className="text-left py-2 px-2">Tipo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsed.map((item, i) => (
                            <tr key={i} className="border-b last:border-0">
                              <td className="py-2 px-2 text-muted-foreground">{i + 1}</td>
                              <td className="py-2 px-2 font-medium">{item.title}</td>
                              <td className="py-2 px-2">{item.address}</td>
                              <td className="py-2 px-2">{item.zona}</td>
                              <td className="py-2 px-2 text-right">{item.price}EUR</td>
                              <td className="py-2 px-2 text-center">{item.bedrooms}</td>
                              <td className="py-2 px-2">{item.property_type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {importing && (
                      <div className="mt-4">
                        <Label className="text-sm text-muted-foreground mb-2 block">
                          Importando... {progress}%
                        </Label>
                        <Progress value={progress} />
                      </div>
                    )}

                    <div className="flex gap-3 mt-4">
                      <Button onClick={handleImport} disabled={importing} size="lg">
                        <Upload className="mr-2 h-4 w-4" />
                        {importing ? `Importando... ${progress}%` : `Importar ${parsed.length} pisos`}
                      </Button>
                      <Button variant="outline" onClick={() => setParsed([])}>
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BulkImport;
