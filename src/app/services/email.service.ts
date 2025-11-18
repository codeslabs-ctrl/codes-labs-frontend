import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

export interface ContactFormData {
  nombreContacto: string;
  nombreEmpresa: string;
  emailContacto: string;
  telefonoContacto: string;
  comentarios: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly SERVICE_ID = 'YOUR_SERVICE_ID'; // Reemplazar con tu Service ID de EmailJS
  private readonly TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Reemplazar con tu Template ID de EmailJS
  private readonly PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Reemplazar con tu Public Key de EmailJS

  constructor() {
    // Inicializar EmailJS
    emailjs.init(this.PUBLIC_KEY);
  }

  async sendContactEmail(formData: ContactFormData): Promise<{ success: boolean; message: string }> {
    try {
      // Formatear el email de manera profesional
      const emailContent = this.formatProfessionalEmail(formData);

      const templateParams = {
        to_email: 'codes.labs.rc@gmail.com',
        from_name: formData.nombreContacto,
        from_email: formData.emailContacto,
        company_name: formData.nombreEmpresa,
        phone: formData.telefonoContacto,
        message: emailContent,
        subject: `Nuevo Contacto de ${formData.nombreEmpresa} - ${formData.nombreContacto}`
      };

      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        return {
          success: true,
          message: 'Mensaje enviado exitosamente. Te contactaremos pronto.'
        };
      } else {
        return {
          success: false,
          message: 'Error al enviar el mensaje. Por favor, intenta nuevamente.'
        };
      }
    } catch (error) {
      console.error('Error enviando email:', error);
      return {
        success: false,
        message: 'Error al enviar el mensaje. Por favor, intenta nuevamente más tarde.'
      };
    }
  }

  private formatProfessionalEmail(formData: ContactFormData): string {
    const fecha = new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Formato HTML profesional para el email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin: -30px -30px 30px -30px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .info-section {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e5e5;
          }
          .info-section:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #06b6d4;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .info-value {
            font-size: 16px;
            color: #333;
            margin-bottom: 0;
          }
          .comments-section {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #06b6d4;
            margin-top: 20px;
          }
          .comments-section .info-label {
            margin-bottom: 10px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          .footer-logo {
            color: #06b6d4;
            font-weight: 600;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>📧 Nuevo Contacto - Codes-Labs</h1>
          </div>
          
          <div class="info-section">
            <div class="info-label">👤 Nombre de Contacto</div>
            <div class="info-value">${this.escapeHtml(formData.nombreContacto)}</div>
          </div>
          
          <div class="info-section">
            <div class="info-label">🏢 Empresa</div>
            <div class="info-value">${this.escapeHtml(formData.nombreEmpresa)}</div>
          </div>
          
          <div class="info-section">
            <div class="info-label">📧 Email de Contacto</div>
            <div class="info-value">
              <a href="mailto:${formData.emailContacto}" style="color: #06b6d4; text-decoration: none;">
                ${this.escapeHtml(formData.emailContacto)}
              </a>
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-label">📞 Teléfono de Contacto</div>
            <div class="info-value">
              <a href="tel:${formData.telefonoContacto}" style="color: #06b6d4; text-decoration: none;">
                ${this.escapeHtml(formData.telefonoContacto)}
              </a>
            </div>
          </div>
          
          ${formData.comentarios ? `
          <div class="comments-section">
            <div class="info-label">💬 Comentarios / Mensaje</div>
            <div class="info-value">${formData.comentarios}</div>
          </div>
          ` : ''}
          
          <div class="footer">
            <div class="footer-logo">Codes-Labs</div>
            <div style="margin-top: 5px;">Este mensaje fue enviado desde el formulario de contacto</div>
            <div style="margin-top: 5px; color: #999;">Fecha: ${fecha}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Versión de texto plano como fallback
    const textContent = `
═══════════════════════════════════════════════════════
  NUEVO CONTACTO - CODES-LABS
═══════════════════════════════════════════════════════

👤 NOMBRE DE CONTACTO:
   ${formData.nombreContacto}

🏢 EMPRESA:
   ${formData.nombreEmpresa}

📧 EMAIL DE CONTACTO:
   ${formData.emailContacto}

📞 TELÉFONO DE CONTACTO:
   ${formData.telefonoContacto}

${formData.comentarios ? `💬 COMENTARIOS / MENSAJE:
   ${formData.comentarios}

` : ''}═══════════════════════════════════════════════════════
Fecha: ${fecha}
═══════════════════════════════════════════════════════
    `;

    // Retornar ambos formatos (EmailJS puede usar HTML)
    return htmlContent;
  }

  private escapeHtml(text: string): string {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

