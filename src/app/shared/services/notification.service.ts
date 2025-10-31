import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  notify(
    message: string,
    type: 'success-toast' | 'error-toast' | 'neutral-toast',
    duration: number = 3000
  ) {
    let severity: 'success' | 'error' | 'info' | 'warn';
    
    switch (type) {
      case 'success-toast':
        severity = 'success';
        break;
      case 'error-toast':
        severity = 'error';
        break;
      case 'neutral-toast':
        severity = 'info';
        break;
      default:
        severity = 'info';
    }

    this.messageService.add({
      severity,
      summary: '', 
      detail: message,
      life: duration,
      icon: this.getIconForSeverity(severity),
    });
  }

  private getIconForSeverity(severity: 'success' | 'error' | 'info' | 'warn'): string {
    switch (severity) {
      case 'success':
        return 'pi pi-check-circle';
      case 'error':
        return 'pi pi-times-circle';
      case 'info':
        return 'pi pi-info-circle';
      case 'warn':
        return 'pi pi-exclamation-triangle';
      default:
        return 'pi pi-info-circle';
    }
  }
}
