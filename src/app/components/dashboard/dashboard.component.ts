import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../services/survey.service';
import { Question, Survey } from '../../interfaces/survey.model';
import { Router } from '@angular/router'; // Импортируйте Router для навигации
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '../../dictioanary/translate.pipe';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  surveys: Survey[] = [];
  questions: Question[] = [];
  

  constructor(
    private surveyService: SurveyService, 
    private router: Router,
    private authService: AuthService,
    public translateService: TranslateService
   ) { // Внедрите Router
  }

  ngOnInit(): void {
    this.loadSurveys(); // Загрузка опросов при инициализации
  }

  loadSurveys(): void {
    this.surveyService.getSurveys().subscribe(surveys => {
      this.surveys = surveys;
    });
  }

  selectQuestionnaire(surveyId: number): void {
    this.router.navigate(['/survey-details', surveyId]); // Используйте surveyId
  }

  getTranslation(key: string): string {
    return this.translateService.getTranslation(key);
  }

  switchLanguage(lang: 'en' | 'ru') {
    this.translateService.setLanguage(lang);
  }
}
