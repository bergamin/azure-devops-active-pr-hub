import { Component, OnInit } from '@angular/core';
import { UserAgentUtils } from "./utils/user-agent.utils";
import { SidenavItem } from "./models/sidenav-item.model";
import { Title } from "@angular/platform-browser";
import { PathService } from "./services/path.service";
import { app } from "./utils/constants.utils";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Active Pull Requests Hub';
  subtitle = '';
  isSidenavOpen = UserAgentUtils.isMobile();
  isSearchVisible = false;
  searchText = '';
  sidenavItems = [
    new SidenavItem('Home', '/home', 'home', true),
    new SidenavItem('Settings', '/settings', 'settings'),
    new SidenavItem('About', '/about', 'dialog-information'),
  ];

  constructor(
    private tabTitle: Title,
    private pathService: PathService,
  ) { }

  ngOnInit() {
    console.log(`${this.title} v${app.version}`)
    this.tabTitle.setTitle(this.title);
    this.toggleSidenav();
  }

  showSearchField() {
    this.isSidenavOpen = true;
    this.isSearchVisible = true;
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    searchInput.focus();
  }

  requestFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  toggleSidenav(sidenavItem?: SidenavItem) {
    let selected = false;

    this.sidenavItems.forEach(item => {
      if (sidenavItem) {
        item.selected = item.path === sidenavItem.path;
      } else {
        item.selected = item.path === this.pathService.getCurrentPath();
      }
      if (item.selected) {
        selected = true;
        this.subtitle = item.text;
        this.tabTitle.setTitle(`${this.subtitle} - ${this.title}`);
      }
    });
    if (!selected) {
      this.sidenavItems.forEach(item => {
        if (item.path === '/home') {
          item.selected = true;
          this.subtitle = item.text;
          this.tabTitle.setTitle(`${this.subtitle} - ${this.title}`);
        }
      });
    }
  }
}
