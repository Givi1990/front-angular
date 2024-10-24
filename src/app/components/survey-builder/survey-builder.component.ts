import { Component } from '@angular/core';
import { Question, Survey } from '../../interfaces/survey.model'; // Проверьте правильность пути
import { SurveyService } from '../../services/survey.service'; // Импортируйте свой сервис
import { AuthService } from '../../services/auth.service'; // Импортируйте AuthService
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-builder',
  templateUrl: './survey-builder.component.html',
  styleUrls: ['./survey-builder.component.scss']
})
export class SurveyBuilderComponent {
  template: Survey = {
    title: '',
    description: '',
    theme: '',
    tags: [],
    questions: [],
    imageUrl: '' // Добавлено поле для URL изображения
  };

  themes: string[] = ['Образование', 'Викторина', 'Другое'];
  tagInput: string = '';
  suggestions: string[] = [];

  constructor(
    private surveyService: SurveyService, 
    private authService: AuthService, 
    private router: Router
  ) { } 

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.template.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onTagInput() {
    const input = this.tagInput.toLowerCase();
    this.suggestions = this.getTags().filter(tag => tag.toLowerCase().includes(input));
  }

  getTags(): string[] {
    // Логика для получения тегов из базы данных
    return ['Тег1', 'Тег2', 'Тег3']; // Пример статических тегов
  }

  selectTag(tag: string) {
    if (!this.template.tags.includes(tag)) {
      this.template.tags.push(tag);
      this.clearTagInput();
    }
  }

  addTag() {
    const tag = this.tagInput.trim();
    if (tag && !this.template.tags.includes(tag)) {
      this.template.tags.push(tag);
      this.clearTagInput();
    }
  }

  clearTagInput() {
    this.tagInput = '';
    this.suggestions = [];
  }

  removeTag(tag: string) {
    this.template.tags = this.template.tags.filter(t => t !== tag);
  }

  addQuestion() {
    if (this.template.questions.length < 16) {
      const newQuestionId = Date.now(); // Уникальный ID на основе времени
      this.template.questions.push({
        questionText: '',
        questionType: 'singleLine', // Устанавливаем тип вопроса по умолчанию
        id: newQuestionId,
        options: [], // Изначально варианты пустые
        correctAnswer: '' // Поле для правильного ответа
      });
    }
  }

  removeQuestion(index: number) {
    this.template.questions.splice(index, 1);
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const question = this.template.questions[questionIndex];
    if (question.options && question.options.length > 0) {
      question.options.splice(optionIndex, 1);
    }
  }

  addOption(questionIndex: number) {
    const question = this.template.questions[questionIndex];
    if (!question.options) {
      question.options = []; // Убедитесь, что options инициализированы
    }

    // Проверяем, что новое значение не пустое, прежде чем добавлять
    question.options.push({ option: '', id: Date.now() });
  }

  updateQuestionType(index: number) {
    const question = this.template.questions[index];
    if (question.questionType === 'radio' || question.questionType === 'checkbox') {
      // Добавляем варианты для вопросов типа radio и checkbox
      question.options = [
        { option: '', id: Date.now() },
        { option: '', id: Date.now() + 1 }
      ];
      question.correctAnswer = ''; // Сброс правильного ответа
    }
  }

  onSubmit() {
    // Фильтруем опции, чтобы исключить пустые значения
    this.template.questions.forEach(question => {
      if (question.questionType === 'checkbox') {
        question.options = question.options?.filter(option => option.option.trim() !== '') || [];
      }
    });

    // Получаем userId
    const userId = Number(this.authService.getUserInfo("id"));
    if (userId !== null) {
      this.template.userId = userId; // Присваиваем userId полю userId в шаблоне
    }

    console.log('Созданный опрос:', this.template);
    // Отправка данных опроса на сервер
    this.surveyService.createSurvey(this.template).subscribe(
      response => {
        const userName = this.authService.getUserInfo("username"); 
        console.log('Опрос успешно создан:', response);
        alert(`Опрос ${this.template.title} успешно создан! `);
        this.router.navigate(['/user', userId, userName]);
      },
      error => {
        console.error('Ошибка при создании опроса:', error);
      }
    );
  }
}
