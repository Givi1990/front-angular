import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../services/survey.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  createdSurveys: any[] = []; // Массив для созданных опросов
  completedSurveys: any[] = []; // Добавлено: массив для пройденных опросов
  userId: number | null = null; // Для хранения userId
  constructor(private surveyService: SurveyService, private authService: AuthService, private router: Router) {} // Inject Router

  ngOnInit() {
    this.userId = Number(this.authService.getUserInfo("id")); // Получение userId
    if (this.userId !== null && !isNaN(this.userId)) { // Проверка на null и NaN
        this.getCreatedSurveys(this.userId); // Получение созданных опросов
        this.getUserCompletedSurveys(this.userId); // Получение завершенных опросов
    } else {
        console.error('User ID is null or invalid. User not authenticated.');
    }
}


  getCreatedSurveys(userId: number) {
    this.surveyService.getCreatedSurveys(userId).subscribe(
      surveys => {
        this.createdSurveys = surveys;
        console.log('Созданные опросы:', this.createdSurveys);
      },
      error => {
        console.error('Ошибка при получении опросов:', error);
      }
    );
  }

  getUserCompletedSurveys(userId: number) {
    this.surveyService.getCompletedSurveys(userId).subscribe(
        surveys => {
            this.completedSurveys = surveys; 
            console.log('Пройденные опросы:', this.completedSurveys);
        },
        error => {
            console.error('Ошибка при получении пройденных опросов:', error);
        }
    );
}

  // Метод для редактирования опроса
  editSurvey(surveyId: number) {
    console.log('Editing survey with ID:', surveyId);
    this.router.navigate(['/edit-survey', surveyId]); // Перенаправляем пользователя на страницу редактирования
  }

  // Метод для удаления опроса
  deleteSurvey(surveyId: number) {
    console.log(surveyId);
    
    if (confirm('Are you sure you want to delete this survey?')) {
      this.surveyService.deleteSurvey(surveyId).subscribe(
        response => {
          console.log('Survey deleted:', response);
          this.loadCreatedSurveys(); // Обновите список созданных опросов после удаления
        },
        error => {
          console.error('Error deleting survey:', error);
        }
      );
    }
  }

  // Метод для загрузки созданных опросов (пример)
  loadCreatedSurveys() {
    if (this.userId !== null) {
      this.surveyService.getCreatedSurveys(this.userId).subscribe( // Передаем userId
        surveys => {
          this.createdSurveys = surveys;
        },
        error => {
          console.error('Error fetching created surveys:', error);
        }
      );
    } else {
      console.error('User ID is null. Cannot load created surveys.');
    }
  }

  // Метод для просмотра результатов опроса
  viewResults(surveyId: number) {
    console.log('Viewing results for survey ID:', surveyId);
    this.router.navigate(['/survey-results', surveyId]); // Перенаправляем пользователя на страницу с результатами опроса
  }
}
