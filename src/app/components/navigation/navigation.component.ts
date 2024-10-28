import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '../../dictioanary/translate.pipe';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  userDropdownMenu: boolean = false;
  isLoggedIn: boolean = false;
  userId!: number | null;
  isSidebarVisible: boolean = false;
  currentLanguage: 'en' | 'ru' = 'en';

  @Output() sidebarToggle = new EventEmitter<boolean>();

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus(); // Убедитесь, что этот метод вызывается правильно
  }

  toggleUserDropdownMenu() {
    this.userDropdownMenu = !this.userDropdownMenu;
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    this.sidebarToggle.emit(this.isSidebarVisible);
    console.log(this.isSidebarVisible);
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn(); // Убедитесь, что эта строка корректна
    if (this.isLoggedIn) {
      this.userId = Number(this.authService.getUserInfo("id"));
    }
  }

  openLogin() {
    this.router.navigate(['/login']);
    this.userDropdownMenu = false;
  }

  openRegister() {
    this.router.navigate(['/register']);
    this.userDropdownMenu = false;
  }

  goToUserPage() {
    const isAdmin = this.authService.getUserInfo("isAdmin");
    const userId = this.authService.getUserInfo("id");
    const userName = this.authService.getUserInfo("username");

    if (userId && isAdmin) {
      this.router.navigate(['/admin', userId, userName]);
    } else {
      this.router.navigate(['/user', userId, userName]);
    }
    this.userDropdownMenu = false;
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
    this.userDropdownMenu = false;
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ru' : 'en';
    this.translateService.setLanguage(this.currentLanguage);
  }
}
