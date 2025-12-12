import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Layout from "@/components/layout/Layout";
import { useI18n } from "@/contexts/I18nContext";
import { analytics } from "@/utils/analytics";
import { toast } from "sonner";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

const ticketSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").regex(/\s/, "Ingresá nombre y apellido"),
  email: z.string().email("Email inválido"),
  role: z.string().min(1, "Seleccioná tu rol"),
  language: z.string().min(1, "Seleccioná idioma preferido"),
  topic: z.string().min(1, "Seleccioná un tema"),
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres").max(100, "Máximo 100 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres").max(2000, "Máximo 2000 caracteres"),
  listingId: z.string().optional(),
  bookingId: z.string().optional(),
  applicationId: z.string().optional(),
  gdprConsent: z.boolean().refine(val => val === true, "Debes aceptar el procesamiento de datos"),
  // Anti-spam honeypot
  website: z.string().max(0, "Campo no válido")
});

type TicketForm = z.infer<typeof ticketSchema>;

const Submit = () => {
  const { t, language } = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  const form = useForm<TicketForm>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      language: language,
      topic: new URLSearchParams(window.location.search).get('topic') || "",
      subject: new URLSearchParams(window.location.search).get('subject') || "",
      description: new URLSearchParams(window.location.search).get('description') || "",
      listingId: "",
      bookingId: "",
      applicationId: "",
      gdprConsent: false,
      website: ""
    }
  });

  useEffect(() => {
    analytics.track('support_submit_viewed');
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    const validFiles = selectedFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Archivo muy grande", {
          description: `${file.name} supera los 10MB`
        });
        return false;
      }
      
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast.error("Tipo de archivo no válido", {
          description: `${file.name} debe ser PDF, JPG o PNG`
        });
        return false;
      }
      
      return true;
    });

    if (files.length + validFiles.length > 5) {
      toast.error("Máximo 5 archivos", {
        description: "Puedes subir hasta 5 archivos por ticket"
      });
      return;
    }

    setFiles(prev => [...prev, ...validFiles]);
    analytics.track('support_attach_added', { count: validFiles.length });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onSubmit = async (data: TicketForm) => {
    // Anti-spam checks
    const now = Date.now();
    if (now - lastSubmitTime < 10000) { // 10 seconds
      toast.error("Demasiado rápido", {
        description: "Espera 10 segundos antes de enviar otro ticket"
      });
      return;
    }

    if (data.website) { // Honeypot field
      if (import.meta.env.DEV) {
        console.warn('Spam attempt detected');
      }
      return;
    }

    setIsSubmitting(true);
    setLastSubmitTime(now);

    try {
      // Mock ticket creation
      const ticketId = `CR-${Date.now().toString(36).toUpperCase()}`;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock ticket data
      const ticket = {
        id: ticketId,
        ...data,
        attachments: files.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size
        })),
        status: 'open',
        created_at: new Date().toISOString()
      };

      if (import.meta.env.DEV) {
        console.log('Ticket created:', ticket);
      }
      
      analytics.track('support_ticket_created', {
        topic: data.topic,
        role: data.role,
        language: data.language,
        has_attachments: files.length > 0,
        attachment_count: files.length
      });

      // Redirect to success page
      window.location.href = `/support/success?id=${ticketId}`;
      
    } catch (error) {
      console.error('Error creating ticket:', error);
      analytics.track('support_submit_error', { error: error.message });
      
      toast.error("Error al enviar", {
        description: "No pudimos enviar tu ticket. Prueba de nuevo."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4 -ml-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">
            {t('support.submit_title')}
          </h1>
          <p className="text-muted-foreground">
            {t('support.submit_description')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del ticket</CardTitle>
            <CardDescription>
              Completa todos los campos para que podamos ayudarte mejor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Honeypot field - hidden from users */}
                <input
                  type="text"
                  name="website"
                  style={{ position: 'absolute', left: '-9999px' }}
                  {...form.register('website')}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre completo *</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan Pérez" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="juan@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tu rol *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="student">Estudiante</SelectItem>
                            <SelectItem value="landlord">Propietario</SelectItem>
                            <SelectItem value="agency">Inmobiliaria</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idioma preferido *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tema *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cuenta">Cuenta & Acceso</SelectItem>
                            <SelectItem value="busqueda">Búsqueda</SelectItem>
                            <SelectItem value="solicitudes">Solicitudes</SelectItem>
                            <SelectItem value="visitas">Visitas</SelectItem>
                            <SelectItem value="pagos">Pagos/Reservas</SelectItem>
                            <SelectItem value="contratos">Contratos</SelectItem>
                            <SelectItem value="erasmus">Erasmus</SelectItem>
                            <SelectItem value="privacidad">Privacidad/GDPR</SelectItem>
                            <SelectItem value="fraud">Reportar fraude/abuso</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asunto *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Describe brevemente tu consulta" 
                          maxLength={100}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/100 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Cuéntanos con detalle tu consulta. Incluye pasos para reproducir el problema si aplica."
                          rows={6}
                          maxLength={2000}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/2000 caracteres. Incluye capturas de pantalla si ayuda.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Optional ID fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="listingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing ID (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="ej: LST123" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bookingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booking ID (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="ej: BK456" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="applicationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application ID (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="ej: APP789" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* File uploads */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Adjuntos (opcional)
                    </label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label 
                        htmlFor="file-upload" 
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Haz clic para subir archivos
                        </span>
                        <span className="text-xs text-muted-foreground">
                          PDF, JPG, PNG • Máx 10MB c/u • Hasta 5 archivos
                        </span>
                      </label>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Archivos adjuntos:</h4>
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          {file.type === 'application/pdf' ? (
                            <FileText className="h-5 w-5 text-red-500" />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-blue-500" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* GDPR Consent */}
                <FormField
                  control={form.control}
                  name="gdprConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">
                          Acepto el procesamiento de datos *
                        </FormLabel>
                        <FormDescription>
                          Acepto que procesen estos datos para atender mi consulta. Ver{" "}
                          <a href="/legal/privacy" className="text-primary hover:underline">
                            Política de Privacidad
                          </a>
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit buttons */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar ticket"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => window.history.back()}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Submit;