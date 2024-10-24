import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isSidebarHidden = true;
  isSidebarVisible = false;
  windowWidth: number = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(_event: UIEvent) {
    this.windowWidth = window.innerWidth;
    this.checkWindowWidth();
    console.log('Window resized:', this.windowWidth); // Лог для проверки изменения ширины окна
  }

  ngOnInit() {
    this.checkWindowWidth();
  }

  checkWindowWidth() {
    this.isSidebarHidden = this.windowWidth < 992;
    if (this.isSidebarHidden) {
      this.isSidebarVisible = false;
    }
    console.log('isSidebarHidden:', this.isSidebarHidden); // Лог для отладки
  }

  onSidebarToggle(isVisible: boolean) {
    console.log('Sidebar toggle event received:', isVisible); // Лог для отладки события
    console.log('this.isSidebarVisible', this.isSidebarVisible);
    console.log('this.isSidebarHidden', this.isSidebarHidden);
    
    this.isSidebarVisible = isVisible;
    this.isSidebarHidden = !isVisible;
  }
}
