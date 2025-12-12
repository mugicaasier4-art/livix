import { useState } from 'react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface ReportData {
  period: string;
  totalViews: number;
  totalApplications: number;
  approvedApplications: number;
  conversionRate: number;
  projectedRevenue: number;
  averagePrice?: number;
  viewsByDay?: any[];
  viewsByListing?: any[];
  applicationsByStatus?: any[];
  recentViews?: any[];
}

export const usePdfReport = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async (data: ReportData, userName: string) => {
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Header
      pdf.setFontSize(20);
      pdf.text('Informe de Analytics - Livix', 20, 20);
      
      pdf.setFontSize(12);
      pdf.text(`Propietario: ${userName}`, 20, 35);
      pdf.text(`Periodo: ${data.period}`, 20, 42);
      pdf.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 20, 49);
      
      // Line separator
      pdf.setLineWidth(0.5);
      pdf.line(20, 55, 190, 55);
      
      // Main metrics
      pdf.setFontSize(16);
      pdf.text('Métricas Principales', 20, 65);
      
      pdf.setFontSize(11);
      pdf.text(`Visitas totales: ${data.totalViews}`, 25, 75);
      pdf.text(`Solicitudes recibidas: ${data.totalApplications}`, 25, 82);
      pdf.text(`Solicitudes aprobadas: ${data.approvedApplications}`, 25, 89);
      pdf.text(`Tasa de conversión: ${data.conversionRate.toFixed(1)}%`, 25, 96);
      pdf.text(`Ingresos proyectados: €${data.projectedRevenue.toLocaleString()}`, 25, 103);
      
      if (data.averagePrice) {
        pdf.text(`Precio promedio: €${data.averagePrice.toFixed(0)}/mes`, 25, 110);
      }
      
      // Line separator
      pdf.line(20, 120, 190, 120);
      
      // Performance summary
      pdf.setFontSize(16);
      pdf.text('Resumen de Rendimiento', 20, 130);
      
      pdf.setFontSize(10);
      let yPos = 140;
      
      if (data.viewsByListing && data.viewsByListing.length > 0) {
        pdf.text('Top Anuncios por Visitas:', 25, yPos);
        yPos += 7;
        
        data.viewsByListing.slice(0, 5).forEach((item, index) => {
          pdf.text(`${index + 1}. ${item.name || 'Anuncio'}: ${item.value} visitas`, 30, yPos);
          yPos += 6;
        });
      }
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Este informe fue generado automáticamente por Livix', 20, 280);
      pdf.text('Para más información, visita tu panel de control en Livix', 20, 285);
      
      // Save
      pdf.save(`livix-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success('Informe generado', {
        description: 'El PDF se ha descargado correctamente'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar PDF', {
        description: 'No se pudo crear el informe'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateReport, isGenerating };
};
