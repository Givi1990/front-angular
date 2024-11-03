import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.servise';
import { User } from '../../interfaces/survey.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '../../dictioanary/translate.pipe';

@Component({
  selector: 'app-register',
  templateUrl: './user-registr.component.html',
  styleUrls: ['./user-registr.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private usersService: UsersService,
    private router: Router,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Добавлена валидация для email
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const user: User = {
        id: 0, // Установите начальное значение или получите его с сервера
        username: this.registerForm.value.username, // Имя пользователя
        email: this.registerForm.value.email, // Email пользователя
        password: this.registerForm.value.password,
        isAdmin: false, // Установите начальное значение
        isBlocked: false, // Установите начальное значение
        registrationDate: new Date(),
        salesforce: false
      };
      
      console.log(user);
      
      this.usersService.register(user).subscribe((response: any) => {
        if (response) {
          console.log('Пользователь зарегистрирован:', response);
          this.router.navigate(['/login']);
        } else {
          console.error('Ошибка регистрации пользователя');
          // Логика для обработки ошибки
        }
      });
    } else {
      console.error('Форма регистрации не валидна:', this.registerForm.errors);
    }
  }

  getTranslation(key: string): string {
    return this.translateService.getTranslation(key);
  }

  switchLanguage(lang: 'en' | 'ru') {
    this.translateService.setLanguage(lang);
  }
  
}
