import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ErrorResponse, LoginResponse } from '../../interfaces/survey.model';
import { Router } from '@angular/router'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '../../dictioanary/translate.pipe';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public translateService: TranslateService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
      this.authService.login(username, password).subscribe(
        (response: LoginResponse) => {
          console.log('Успешный вход:', response);
          if (response.token) {
            this.authService.saveToken(response.token);
          }
          
          this.router.navigate(["/"]);
          
          
          
          setTimeout(() => {
            window.location.reload();
          }, 100);  
        },
        (error: ErrorResponse) => {
          console.error('Ошибка входа:', error.message);
        }
      );
    }
  }

  getTranslation(key: string): string {
    return this.translateService.getTranslation(key);
  }

  switchLanguage(lang: 'en' | 'ru') {
    this.translateService.setLanguage(lang);
  }
  
}
