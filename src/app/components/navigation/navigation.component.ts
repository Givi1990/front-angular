import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  @Output() sidebarToggle = new EventEmitter<boolean>(); // Изменено на boolean

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  toggleUserDropdownMenu() {
    this.userDropdownMenu = !this.userDropdownMenu;
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible; // Переключаем состояние
    this.sidebarToggle.emit(this.isSidebarVisible); // Отправляем текущее состояние
    console.log(this.isSidebarVisible); // Выводим состояние в консоль
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
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
}
