import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ResumeService } from '../../../services/resume/resume-service';
import { Resume } from '../../../types/resume.types';

@Component({
  selector: 'app-resume-preview',
  templateUrl: './resume-preview.html',
  styleUrls: ['./resume-preview.css'],
})
export class ResumePreviewComponent implements OnInit {
  @ViewChild('resumeContent', { static: false }) resumeContent!: ElementRef;

  resume!: Resume;
  isGeneratingPDF: boolean = false;
  isLoadingResume: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resumeService: ResumeService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const resumeId = params['id'];
      if (resumeId) {
        this.loadResume(resumeId);
      }
    });
  }

  loadResume(id: string): void {
    this.resumeService.getResumeByUserAndResumeId(id).subscribe({
      next: (response) => {
        this.isLoadingResume = true;
        this.resume = response.resume;
        this.isLoadingResume = false;
      },
      error: (error) => {
        console.error('Error loading resume:', error);
        this.isLoadingResume = false;
      },
    });
  }

  async downloadPDF(): Promise<void> {
    if (!this.resumeContent) {
      console.error('Resume content not found');
      return;
    }

    this.isGeneratingPDF = true;

    try {
      const element = this.resumeContent.nativeElement;

      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;

      // Calculate how the canvas fits on A4
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const imgData = canvas.toDataURL('image/png', 0.98);

      // Calculate how many pages we need
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 0;

      // Add pages
      while (heightLeft > 0) {
        if (pageNumber > 0) {
          pdf.addPage();
        }

        // Calculate the portion of the image to add to this page
        const pageCanvas = document.createElement('canvas');
        const pageHeight = Math.min(heightLeft, pdfHeight);

        pageCanvas.width = canvas.width;
        pageCanvas.height = (pageHeight / imgWidth) * canvas.width;

        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          // Fill with white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

          // Draw the appropriate portion of the original canvas
          const sourceY = (position / imgHeight) * canvas.height;
          const sourceHeight = pageCanvas.height;

          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceHeight,
            0,
            0,
            pageCanvas.width,
            pageCanvas.height,
          );

          const pageImgData = pageCanvas.toDataURL('image/png', 0.98);
          pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageHeight);
        }

        heightLeft -= pdfHeight;
        position += pdfHeight;
        pageNumber++;
      }

      // Generate filename
      const fileName = `${this.resume.extractedContent.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;

      // Download
      pdf.save(fileName);

      console.log('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      this.isGeneratingPDF = false;
    }
  }

  onBack(): void {
    this.router.navigate(['generate-resume']);
  }
}
