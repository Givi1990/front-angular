import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ErrorResponse, LoginResponse } from '../../interfaces/survey.model';
import { Router } from '@angular/router'; // Импортируем Router
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private router: Router // Внедряем Router
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
          setTimeout(() => {
            this.router.navigate(['']);
          }, 100);  
        },
        (error: ErrorResponse) => {
          console.error('Ошибка входа:', error.message);
        }
      );
    }
  }
  
}
