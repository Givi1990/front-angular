import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../../services/survey.service'; // Импортируйте свой сервис
import { AuthService } from '../../services/auth.service'; // Импортируйте AuthService
import { Survey } from '../../interfaces/survey.model';
import { TranslateService } from '../../dictioanary/translate.pipe';

@Component({
  selector: 'app-edit-survey',
  templateUrl: './edit-survey.component.html',
  styleUrls: ['./edit-survey.component.scss']
})
export class EditSurveyComponent implements OnInit {
  surveyId!: number;
  template: Survey = this.initializeTemplate(); // Инициализация с значениями по умолчанию

  themes: string[] = ['Образование', 'Викторина', 'Другое'];
  tagInput: string = '';
  suggestions: string[] = [];

  constructor(
    private surveyService: SurveyService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public translateService: TranslateService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.surveyId = Number(id);
    this.loadSurvey();
  }
  
  // Метод инициализации шаблона
  initializeTemplate(): Survey {
    return {
      title: '',
      description: '',
      theme: '',
      tags: [],
      questions: [], // Начинаем с пустого массива для вопросов
    };
  }

  // Метод для загрузки опроса по ID
  loadSurvey() {
    this.surveyService.getSurveyById(this.surveyId).subscribe(
      (survey: Survey) => {
        this.template = survey;
      },
      error => {
        console.error('Ошибка при загрузке опроса:', error);
      }
    );
  }

  // Обработчик ввода тега
  onTagInput() {
    const input = this.tagInput.toLowerCase();
    this.suggestions = this.getTags().filter(tag => tag.toLowerCase().includes(input));
  }

  // Получение статических тегов
  getTags(): string[] {
    return ['Тег1', 'Тег2', 'Тег3']; // Пример статических тегов
  }

  // Выбор тега
  selectTag(tag: string) {
    if (!this.template.tags.includes(tag)) {
      this.template.tags.push(tag);
      this.clearTagInput();
    }
  }

  // Добавление тега
  addTag() {
    const tag = this.tagInput.trim();
    if (tag && !this.template.tags.includes(tag)) {
      this.template.tags.push(tag);
      this.clearTagInput();
    }
  }

  // Очистка поля ввода тега
  clearTagInput() {
    this.tagInput = '';
    this.suggestions = [];
  }

  // Удаление тега
  removeTag(tag: string) {
    this.template.tags = this.template.tags.filter(t => t !== tag);
  }

  // Добавление вопроса
  addQuestion() {
    if (this.template.questions.length < 4) {
      const newQuestionId = Date.now();
      this.template.questions.push({
        questionText: '',
        questionType: 'singleLine',
        id: newQuestionId,
        options: [],
        correctAnswer: ''
      });
    }
  }

  // Удаление вопроса
  removeQuestion(index: number) {
    this.template.questions.splice(index, 1);
  }

  // Удаление варианта ответа
  removeOption(questionIndex: number, optionIndex: number) {
    const question = this.template.questions[questionIndex];
    if (question.options && question.options.length > 0) {
      question.options.splice(optionIndex, 1);
    }
  }

  // Добавление варианта ответа
  addOption(questionIndex: number) {
    const question = this.template.questions[questionIndex];
    if (!question.options) {
      question.options = [];
    }
    question.options.push({ option: '', id: Date.now() });
  }

  // Обновление типа вопроса
  updateQuestionType(index: number) {
    const question = this.template.questions[index];
    if (question.questionType === 'radio' || question.questionType === 'checkbox') {
      question.options = [
        { option: '', id: Date.now() },
        { option: '', id: Date.now() + 1 }
      ];
      question.correctAnswer = '';
    }
  }

  // Обработчик отправки формы
  onSubmit() {
    this.template.questions.forEach(question => {
      if (question.questionType === 'checkbox') {
        question.options = question.options?.filter(option => option.option.trim() !== '') || [];
      }
    });

    const userId = Number(this.authService.getUserInfo("id"));
    if (userId !== null) {
      this.template.userId = userId;
    }

    console.log('Редактированный опрос:', this.template);
    this.surveyService.updateSurvey(this.template).subscribe(
      response => {
        console.log('Опрос успешно обновлён:', response);
      },
      error => {
        console.error('Ошибка при обновлении опроса:', error);
      }
    );
  }

  getTranslation(key: string): string {
    return this.translateService.getTranslation(key);
  }

  switchLanguage(lang: 'en' | 'ru') {
    this.translateService.setLanguage(lang);
  }
}
