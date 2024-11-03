import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../services/survey.service';
import { ActivatedRoute } from '@angular/router';
import { Survey, Question, Response } from '../../interfaces/survey.model';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '../../dictioanary/translate.pipe';

@Component({
  selector: 'app-survey-details',
  templateUrl: './survey-details.component.html',
  styleUrls: ['./survey-details.component.scss']
})
export class SurveyDetailsComponent implements OnInit {
  survey: Survey | null = null;
  questions: Question[] = [];
  responses: Response[] = []; 

  constructor(
    private surveyService: SurveyService,
    private route: ActivatedRoute,
    private authService: AuthService,
    public translateService: TranslateService
  ) {}
  

  ngOnInit(): void {
    const surveyId = Number(this.route.snapshot.paramMap.get('id')); 
    this.loadSurvey(surveyId);
  }


  loadSurvey(surveyId: number): void {
    this.surveyService.getSurveyById(surveyId).subscribe(
      survey => {
        this.survey = survey;
        console.log('Загруженный опрос:', this.survey); 
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
        console.log('Полученные вопросы:', this.questions); 
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
      question.selectedOption = []; 
    }
    const index = question.selectedOption.indexOf(optionId);
    if (index > -1) {
      question.selectedOption.splice(index, 1);
    } else {
      question.selectedOption.push(optionId);
    }
  }


  submitAnswers(): void {
    const userId = Number(this.authService.getUserInfo("id"));
    const surveyId = Number(this.route.snapshot.paramMap.get('id')); 
    if (userId != null) {
      this.collectResponses(userId);
      console.log('Подготовленные ответы для отправки:', this.responses);
      this.surveyService.submitResponses(surveyId, this.responses) 
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


  collectResponses(userId: number): void {
    this.responses = this.questions.map(question => {
      const { id: questionId, surveyId = 0, questionType, options, selectedOption } = question;
      let answerText: string | null = null;
  
      if (questionType === 'radio' && typeof selectedOption === 'number') {
        answerText = options?.find(opt => opt.id === selectedOption)?.option || null;
      } else if (questionType === 'checkbox' && Array.isArray(selectedOption)) {
        answerText = selectedOption
          .map(optionId => options?.find(opt => opt.id === optionId)?.option || null)
          .filter(Boolean)
          .join(', ');
      } else if (selectedOption !== null && selectedOption !== undefined) {
        answerText = selectedOption.toString();
      }
      return {
        questionId,
        answerText,
        userId,
        surveyId
      };
    });
  }
  


getTranslation(key: string): string {
  return this.translateService.getTranslation(key);
}


switchLanguage(lang: 'en' | 'ru') {
  this.translateService.setLanguage(lang);
}

  
}
