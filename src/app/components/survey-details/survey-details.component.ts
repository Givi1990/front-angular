import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../services/survey.service';
import { ActivatedRoute } from '@angular/router';
import { Survey, Question, Response, Option } from '../../interfaces/survey.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-survey-details',
  templateUrl: './survey-details.component.html',
  styleUrls: ['./survey-details.component.scss']
})
export class SurveyDetailsComponent implements OnInit {
  survey: Survey | null = null;
  questions: Question[] = [];
  responses: Response[] = []; // Массив для хранения ответов

  constructor(
    private surveyService: SurveyService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const surveyId = Number(this.route.snapshot.paramMap.get('id')); // Получение ID из маршрута
    this.loadSurvey(surveyId);
  }

  loadSurvey(surveyId: number): void {
    this.surveyService.getSurveyById(surveyId).subscribe(
      survey => {
        this.survey = survey;
        console.log('Загруженный опрос:', this.survey); // Логируем загруженный опрос
        this.getSurveyQuestions(surveyId);
      },
      error => {
        console.error('Ошибка при загрузке опроса:', error);
      }
    );
  }
  
  getSurveyQuestions(surveyId: number): void {
    this.surveyService.getSurveyQuestions(surveyId).subscribe(
      data => {
        this.questions = data;
        console.log('Полученные вопросы:', this.questions); // Логируем полученные вопросы
        this.questions.forEach(question => {
          if (question.questionType === 'checkbox') {
            question.selectedOption = [];
          } else {
            question.selectedOption = null;
          }
        });
      },
      error => {
        console.error('Ошибка при получении вопросов:', error);
      }
    );
  }
  

  onCheckboxChange(question: Question, optionId: number): void {
    if (!Array.isArray(question.selectedOption)) {
      question.selectedOption = []; // Инициализируем массив для чекбоксов, если он еще не инициализирован
    }

    const index = question.selectedOption.indexOf(optionId);
    if (index > -1) {
      // Если вариант уже выбран, удаляем его
      question.selectedOption.splice(index, 1);
    } else {
      // Если вариант не выбран, добавляем его
      question.selectedOption.push(optionId);
    }
  }

  submitAnswers(): void {
    const userId = Number(this.authService.getUserInfo("id"));
    const surveyId = Number(this.route.snapshot.paramMap.get('id')); // Получаем surveyId из маршрута

    if (userId != null) {
      // Собираем ответы
      this.collectResponses(userId);

      // Логируем собранные ответы перед отправкой
      console.log('Подготовленные ответы для отправки:', this.responses);

      // Отправляем ответы в сервис, включая surveyId
      this.surveyService.submitResponses(surveyId, this.responses) // Передаем surveyId
        .subscribe(
          response => {
            console.log('Ответы успешно отправлены:', response);
          },
          error => {
            console.error('Ошибка при отправке ответов:', error);
          }
        );
    } else {
      console.error('Ошибка: userId отсутствует.');
    }
  }


  


// Ваша функция collectResponses
collectResponses(userId: number): void {
  this.responses = this.questions.map(question => {
    // Проверка на наличие options
    if (!question.options) {
      return {
        questionId: question.id,
        answerText: null, // Если options отсутствуют, возвращаем null
        userId: userId,
        surveyId: question.surveyId ?? 0 // Значение по умолчанию, если surveyId не определено
      };
    }

    let answerText: string | null = null;

    // Обработка типов вопросов
    if (question.questionType === 'radio') {
      const selectedOptionId = question.selectedOption;
      if (typeof selectedOptionId === 'number') {
        const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
        answerText = selectedOption ? selectedOption.option : null; // Получаем текст варианта
      }
    } else if (question.questionType === 'checkbox' && Array.isArray(question.selectedOption)) {
      const selectedTexts = question.selectedOption.map(optionId => {
        if (typeof optionId === 'number') {
          const option = question.options?.find(opt => opt.id === optionId); // Используем оператор опциональной последовательности
          return option ? option.option : null; // Получаем текст варианта
        }
        return null; // Если optionId не число, возвращаем null
      }).filter(text => text !== null); // Фильтруем null значения
      answerText = selectedTexts.join(', '); // Объединяем тексты выбранных вариантов
    } else {
      // Обработка текстовых и числовых ответов
      answerText = question.selectedOption !== null && question.selectedOption !== undefined 
        ? question.selectedOption.toString() 
        : null;
    }

    return {
      questionId: question.id,
      answerText: answerText,
      userId: userId,
      surveyId: question.surveyId ?? 0 // Значение по умолчанию, если surveyId не определено
    };
  });
}




  
}
