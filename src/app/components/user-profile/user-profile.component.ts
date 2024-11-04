import { Component, OnInit } from '@angular/core';
import { SalesforceService } from '../../services/salesforce.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  username: string = ''; 
  password: string = ''; 
  accountName: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isSalesforceRegistered!: boolean;
  isLoading: boolean = true; 

  constructor(
    private salesforceService: SalesforceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); 
  }

  private checkSalesforceRegistration(): void {
    const userId = this.authService.getUserInfo('id'); 

    if (userId) {
      this.authService.getAllUsers().subscribe(
        (data) => {
          const user = data.find(user => user.id === parseInt(userId));
          this.isSalesforceRegistered = user ? user.salesforce : false;
        },
        (error) => {
          console.error('Ошибка при получении пользователей:', error);
        }
      );
    } else {
      console.error('User ID отсутствует.');
    }
  }

  createAccountAndContact(): void {
    if (this.isSalesforceRegistered) {
      return this.setErrorMessage('Вы уже зарегистрированы в Salesforce.');
    }

    const userPayload = {
      accountName: this.accountName,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    };

    if (!this.isUserPayloadValid(userPayload)) {
      return this.setErrorMessage('Пожалуйста, заполните все поля для создания аккаунта.');
    }

    this.salesforceService.createContact(userPayload).subscribe(
      () => {
        this.setSuccessMessage('Аккаунт и контакт успешно созданы в Salesforce!');
        this.updateSalesforceStatus();
      },
      () => this.setErrorMessage('Ошибка при создании аккаунта и контакта.')
    );
  }

  private updateSalesforceStatus(): void {
    const userId = this.authService.getUserInfo('id');

    if (userId) {
      this.authService.updateSalesforceStatus(parseInt(userId)).subscribe(
        () => {
          this.isSalesforceRegistered = true;
          console.log('Статус Salesforce обновлен успешно.');
        },
        (error) => console.error('Ошибка обновления статуса Salesforce:', error)
      );
    }
  }

  private isUserPayloadValid(payload: any): boolean {
    return Object.values(payload).every(value => value);
  }

  private setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.successMessage = null;
  }

  private setSuccessMessage(message: string): void {
    this.successMessage = message;
    this.errorMessage = null;
  }
}
