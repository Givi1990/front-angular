import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SurveyService } from '../../services/survey.service';
import { User } from '../../interfaces/survey.model';
import { Router } from '@angular/router';
import { TranslateService } from '../../dictioanary/translate.pipe';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  users: User[] = []; 
  surveys: any[] = []; 

  constructor(
    private authService: AuthService,
    private surveyService: SurveyService,
    private router: Router,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadUsers(); 
    this.loadSurveys(); 
  }


  navigateToUserPage() {
    const userId = Number(this.authService.getUserInfo("id"))
    const userName = Number(this.authService.getUserInfo("username"))
    this.router.navigate(['/user', userId, userName]);
  }


  loadUsers(): void {
    this.authService.getAllUsers().subscribe(
      (data) => {
        this.users = data; 
        console.log(this.users);
        
      },
      (error) => {
        console.error('Ошибка при получении пользователей:', error);
      }
    );
  }



  loadSurveys(): void {
    this.surveyService.getSurveys().subscribe(
      (data) => {
        this.surveys = data; 
      },
      (error) => {
        console.error('Ошибка при получении опросов:', error);
      }
    );
  }

  toggleBlock(user: User): void {
    const action: 'block' | 'unblock' = user.isBlocked ? 'unblock' : 'block'; // Устанавливаем действие
    this.authService.toggleUserBlock(user.id.toString(), action).subscribe(
      response => {
        console.log('Статус пользователя успешно обновлён:', response);
        user.isBlocked = !user.isBlocked; 
      },
      error => {
        console.error('Ошибка при блокировке/разблокировке пользователя:', error);
      }
    );
  }

 // Метод для удаления пользователя
deleteUser(userId: number): void {
  if (confirm('Вы уверены, что хотите удалить пользователя?')) {
    this.authService.deleteUser(userId.toString()).subscribe(
      response => {
        console.log('Пользователь успешно удалён:', response);
        if (userId === Number(this.authService.getUserInfo("id"))) {
          this.authService.logout(); 
          window.location.reload(); 
        } else {
          this.loadUsers();
        }
      },
      error => {
        console.error('Ошибка при удалении пользователя:', error);
      }
    );
  }
}



  deleteSurvey(surveyId: number): void {
    if (confirm('Вы уверены, что хотите удалить опрос?')) {
      this.surveyService.deleteSurvey(surveyId).subscribe(
        () => {
          console.log('Опрос успешно удалён');
          this.loadSurveys(); 
        },
        (error) => {
          console.error('Ошибка при удалении опроса:', error);
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
