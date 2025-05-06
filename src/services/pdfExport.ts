import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (element: HTMLElement, filename: string): Promise<void> => {
  try {
    // Create loading notification
    const loadingEl = document.createElement('div');
    loadingEl.style.position = 'fixed';
    loadingEl.style.top = '20px';
    loadingEl.style.left = '50%';
    loadingEl.style.transform = 'translateX(-50%)';
    loadingEl.style.padding = '12px 24px';
    loadingEl.style.borderRadius = '4px';
    loadingEl.style.backgroundColor = '#2563EB';
    loadingEl.style.color = 'white';
    loadingEl.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    loadingEl.style.zIndex = '9999';
    loadingEl.textContent = 'Generating PDF...';
    document.body.appendChild(loadingEl);

    // Calculate dimensions
    const originalWidth = element.offsetWidth;
    const originalHeight = element.offsetHeight;
    
    // A4 dimensions (mm)
    const a4Width = 210;
    const a4Height = 297;
    
    // Maintain aspect ratio but fit to A4
    const aspectRatio = originalWidth / originalHeight;
    const pdfWidth = a4Width;
    const pdfHeight = pdfWidth / aspectRatio;
    
    // Create canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#FFFFFF',
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: pdfHeight > a4Height ? 'landscape' : 'portrait',
      unit: 'mm',
    });
    
    // Add title
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Placement Analytics: ${filename.split('-')[0]}`, 14, 14);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(14, 18, 196, 18);
    
    // Add generated date
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 24);
    
    // Add image
    const finalPdfWidth = Math.min(pdfWidth - 20, 190);
    const finalPdfHeight = (finalPdfWidth / aspectRatio);
    
    pdf.addImage(imgData, 'PNG', 10, 30, finalPdfWidth, finalPdfHeight);
    
    // Add page numbers
    const totalPages = 1;
    pdf.setFontSize(10);
    pdf.text(`Page 1 of ${totalPages}`, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 10);
    
    // Add footer
    pdf.setFontSize(8);
    pdf.text('© 2024-2025 Placement Records', 14, pdf.internal.pageSize.getHeight() - 10);
    
    // Save the PDF
    pdf.save(`${filename}.pdf`);
    
    // Remove loading notification
    document.body.removeChild(loadingEl);
    
    // Show success notification
    const successEl = document.createElement('div');
    successEl.style.position = 'fixed';
    successEl.style.top = '20px';
    successEl.style.left = '50%';
    successEl.style.transform = 'translateX(-50%)';
    successEl.style.padding = '12px 24px';
    successEl.style.borderRadius = '4px';
    successEl.style.backgroundColor = '#10B981';
    successEl.style.color = 'white';
    successEl.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    successEl.style.zIndex = '9999';
    successEl.textContent = 'PDF exported successfully!';
    document.body.appendChild(successEl);
    
    // Remove success notification after 3 seconds
    setTimeout(() => {
      document.body.removeChild(successEl);
    }, 3000);
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Show error notification
    const errorEl = document.createElement('div');
    errorEl.style.position = 'fixed';
    errorEl.style.top = '20px';
    errorEl.style.left = '50%';
    errorEl.style.transform = 'translateX(-50%)';
    errorEl.style.padding = '12px 24px';
    errorEl.style.borderRadius = '4px';
    errorEl.style.backgroundColor = '#EF4444';
    errorEl.style.color = 'white';
    errorEl.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    errorEl.style.zIndex = '9999';
    errorEl.textContent = 'Error exporting PDF. Please try again.';
    document.body.appendChild(errorEl);
    
    // Remove error notification after 3 seconds
    setTimeout(() => {
      document.body.removeChild(errorEl);
    }, 3000);
  }
};