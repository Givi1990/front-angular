import { Component } from '@angular/core';
import { Question, Survey } from '../../interfaces/survey.model'; // Проверьте правильность пути
import { SurveyService } from '../../services/survey.service'; // Импортируйте свой сервис
import { AuthService } from '../../services/auth.service'; // Импортируйте AuthService
import { Router } from '@angular/router';
import { TranslateService } from '../../dictioanary/translate.pipe';

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
    imageUrl: '' 
  };

  themes: string[] = ['Образование', 'Викторина', 'Другое'];
  tagInput: string = '';
  suggestions: string[] = [];

  constructor(
    private surveyService: SurveyService, 
    private authService: AuthService, 
    private router: Router,
    public translateService: TranslateService
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
      question.options = []; 
    }
    question.options.push({ option: '', id: Date.now() });
  }


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
    console.log('Созданный опрос:', this.template);
    this.sendTemplateOnServer(userId)
  }


  sendTemplateOnServer(userId: number) {
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


  getTranslation(key: string): string {
    return this.translateService.getTranslation(key);
  }

  switchLanguage(lang: 'en' | 'ru') {
    this.translateService.setLanguage(lang);
  }


}
