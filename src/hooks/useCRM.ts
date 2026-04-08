import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CRMLead {
  id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  tipo: "particular" | "agencia";
  ciudad: string;
  zona: string | null;
  num_pisos: number;
  precio_medio: number | null;
  fuente: string;
  estado: "nuevo" | "contactado" | "interesado" | "reunion" | "publicado" | "rechazado";
  fecha_primer_contacto: string | null;
  fecha_ultimo_contacto: string | null;
  proximo_seguimiento: string | null;
  responsable: string;
  notas: string | null;
  motivo_rechazo: string | null;
  url_portal: string | null;
  created_at: string;
  updated_at: string;
}

export type CRMEstado = CRMLead["estado"];

export const CRM_ESTADOS: { value: CRMEstado; label: string; color: string }[] = [
  { value: "nuevo", label: "Nuevo", color: "bg-gray-100 text-gray-700" },
  { value: "contactado", label: "Contactado", color: "bg-blue-100 text-blue-700" },
  { value: "interesado", label: "Interesado", color: "bg-yellow-100 text-yellow-700" },
  { value: "reunion", label: "Reunion", color: "bg-purple-100 text-purple-700" },
  { value: "publicado", label: "Publicado", color: "bg-green-100 text-green-700" },
  { value: "rechazado", label: "Rechazado", color: "bg-red-100 text-red-700" },
];

export const useCRM = () => {
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("crm_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error("Error fetching CRM leads:", error);
      toast.error("Error al cargar leads del CRM");
    } finally {
      setIsLoading(false);
    }
  };

  const updateLead = async (id: string, updates: Partial<CRMLead>) => {
    try {
      const { error } = await (supabase as any)
        .from("crm_leads")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
      );
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Error al actualizar lead");
      throw error;
    }
  };

  const updateEstado = async (id: string, estado: CRMEstado) => {
    const updates: Partial<CRMLead> = { estado };

    if (estado === "contactado" || estado === "interesado" || estado === "reunion") {
      updates.fecha_ultimo_contacto = new Date().toISOString();
      // Find lead and set primer contacto if not set
      const lead = leads.find((l) => l.id === id);
      if (lead && !lead.fecha_primer_contacto) {
        updates.fecha_primer_contacto = new Date().toISOString();
      }
    }

    await updateLead(id, updates);
    toast.success(`Lead movido a "${CRM_ESTADOS.find((e) => e.value === estado)?.label}"`);
  };

  const addNota = async (id: string, nota: string) => {
    const lead = leads.find((l) => l.id === id);
    const existing = lead?.notas || "";
    const timestamp = new Date().toLocaleDateString("es-ES");
    const newNotas = existing
      ? `${existing}\n[${timestamp}] ${nota}`
      : `[${timestamp}] ${nota}`;

    await updateLead(id, { notas: newNotas });
  };

  const createLead = async (lead: Partial<CRMLead>) => {
    try {
      const { data, error } = await (supabase as any)
        .from("crm_leads")
        .insert(lead)
        .select()
        .single();

      if (error) throw error;
      setLeads((prev) => [data, ...prev]);
      return data;
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error("Error al crear lead");
      throw error;
    }
  };

  const importCSV = async (csvText: string) => {
    const lines = csvText.trim().split("\n");
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());

    const newLeads: Partial<CRMLead>[] = [];

    for (let i = 1; i < lines.length; i++) {
      // Simple CSV parse (handles quoted commas)
      const values: string[] = [];
      let current = "";
      let inQuotes = false;
      for (const ch of lines[i]) {
        if (ch === '"') {
          inQuotes = !inQuotes;
        } else if (ch === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += ch;
        }
      }
      values.push(current.trim());

      const row: any = {};
      header.forEach((h, idx) => {
        row[h] = values[idx] || "";
      });

      if (!row.nombre && !row["nombre inmobiliaria"]) continue;

      newLeads.push({
        nombre: row.nombre || row["nombre inmobiliaria"] || "",
        telefono: row.telefono || null,
        email: row.email || null,
        tipo: "agencia",
        zona: row.zonas || row.zona || null,
        num_pisos: parseInt(row.num_pisos || row["pisos_zona_uni"]) || 1,
        precio_medio: parseInt(row.precio_medio) || null,
        fuente: "scraper",
        estado: "nuevo",
        url_portal: row.urls_ejemplo || row.url_portal || null,
      });
    }

    if (newLeads.length === 0) {
      toast.error("No se encontraron leads validos en el CSV");
      return 0;
    }

    const { error } = await (supabase as any).from("crm_leads").insert(newLeads);

    if (error) {
      console.error("Error importing CSV:", error);
      toast.error("Error al importar CSV");
      return 0;
    }

    await fetchLeads();
    toast.success(`${newLeads.length} leads importados`);
    return newLeads.length;
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return {
    leads,
    isLoading,
    fetchLeads,
    updateLead,
    updateEstado,
    addNota,
    createLead,
    importCSV,
  };
};
