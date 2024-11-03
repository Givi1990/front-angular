import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Импортируем AuthService
import { TranslateService } from '../../dictioanary/translate.pipe';

@Component({
  selector: 'app-slide-bar',
  templateUrl: './slide-bar.component.html',
  styleUrls: ['./slide-bar.component.scss']
})
export class SlideBarComponent {

  isSidebarVisible: boolean = true;

  @Output() sidebarToggle = new EventEmitter<boolean>();

  constructor(
    private router: Router, 
    private authService: AuthService, 
    public translateService: TranslateService
  ) {}

  surveyBuilderNav() {
    if (this.authService.isLoggedIn()) { 
      this.router.navigate(['/survey-builder']); 
    } else {
      this.router.navigate(['/login']); 
    }
    
 
  }


  getTranslation(key: string): string {
    return this.translateService.getTranslation(key);
  }

  switchLanguage(lang: 'en' | 'ru') {
    this.translateService.setLanguage(lang);
  }
}
