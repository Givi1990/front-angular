import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../services/survey.service';
import { ActivatedRoute } from '@angular/router';
import { Survey, Question, Response } from '../../interfaces/survey.model';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '../../dictioanary/translate.pipe';

@Component({
  selector: 'app-survey-results',
  templateUrl: './survey-results.component.html',
  styleUrls: ['./survey-results.component.scss']
})
export class SurveyResultsComponent implements OnInit {
  survey: Survey | null = null; // Хранит информацию об опросе
  questions: Question[] = []; // Хранит вопросы опроса
  responses: Response[] = []; // Массив для хранения ответов
  surveyTitle: string | null = null; // Заголовок опроса
  userAnswers: Response[] = []; // Ответы пользователей

  constructor(
    private surveyService: SurveyService,
    private route: ActivatedRoute,
    private authService: AuthService,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    const surveyId = Number(this.route.snapshot.paramMap.get('id')); // Получение ID из маршрута
    this.loadSurvey(surveyId);
  }

  loadSurvey(surveyId: number): void {
    this.surveyService.getSurveyById(surveyId).subscribe(
      survey => {
        this.survey = survey;
        this.surveyTitle = survey.title; // Устанавливаем заголовок опроса
        this.getSurveyQuestions(surveyId); // Загрузка вопросов после получения опроса
      },
      error => {
        console.error('Ошибка при загрузке опроса:', error);
      }
    );
  }

  getSurveyQuestions(surveyId: number): void {
    this.surveyService.getSurveyQuestions(surveyId).subscribe(
      data => {
        this.questions = data; // Сохраняем вопросы
        this.loadUserResponses(); // Загружаем ответы после получения вопросов
      },
      error => {
        console.error('Ошибка при получении вопросов:', error);
      }
    );
  }

  loadUserResponses(): void {
    const userId = Number(this.authService.getUserInfo("id"));
    const surveyId = Number(this.route.snapshot.paramMap.get('id')); // Получаем surveyId из маршрута

    if (userId != null) {
      this.surveyService.getUserAnswersForSurveyByUser(surveyId, userId).subscribe(
        data => {
          this.userAnswers = data; // Сохраняем ответы
          this.mapResponsesToQuestions(); // Сопоставляем ответы с вопросами
        },
        error => {
          console.error('Ошибка при загрузке ответов на опрос:', error);
        }
      );
    }
  }

  // Метод для сопоставления ответов с вопросами
  mapResponsesToQuestions(): void {
    this.questions.forEach(question => {
      const response = this.userAnswers.find(r => r.questionId === question.id);
      if (response) {
        question.selectedOption = response.answerText; // Или как вы хотите хранить ответ
      }
    });
  }



  getTranslation(key: string): string {
    return this.translateService.getTranslation(key);
  }

  switchLanguage(lang: 'en' | 'ru') {
    this.translateService.setLanguage(lang);
  }
}
