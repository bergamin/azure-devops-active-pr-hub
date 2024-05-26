import {Component, OnInit} from '@angular/core';
import {Settings} from "../../models/settings.model";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settings = new Settings();
  organization = '';
  project = '';
  pat = '';
  repositories = '';

  ngOnInit(): void {
    const storageSettings = localStorage.getItem('settings');
    this.settings = storageSettings
      ? JSON.parse(storageSettings)
      : new Settings();

    this.organization = this.settings.organization;
    this.project = this.settings.project;
    this.pat = '';
    this.repositories = this.settings.repositories
      .map(repo => repo.trim())
      .join(', ');
  }

  save() {
    this.settings.organization = this.organization;
    this.settings.project = this.project;
    if (this.pat) {
      this.settings.base64pat = btoa(`:${this.pat}`);
    }
    this.settings.repositories = this.repositories
      .split(',')
      .map(repo => repo
        .split('"')
        .join('')
        .trim())
      .filter(Boolean);

    localStorage.setItem('settings', JSON.stringify(this.settings));
    this.pat = '';
  }

  reset() {
    this.organization = '';
    this.project = '';
    this.pat = '';
    this.repositories = '';
    this.settings = new Settings();
    localStorage.removeItem('settings');
  }

  export() {
    const storageSettings = localStorage.getItem('settings');
    const settings: Settings = storageSettings
      ? JSON.parse(storageSettings)
      : new Settings();
    settings.base64pat = '';

    const fileName = 'active-pr-hub-config.json';
    const fileContent = JSON.stringify(settings);
    const file = new Blob([fileContent], { type: 'text/plain' });

    const fileLink = document.createElement("a");
    fileLink.href = URL.createObjectURL(file);
    fileLink.download = fileName;
    fileLink.click();
    fileLink.remove();
  }

  async import(event: any) {
    const file: File = event.target.files[0];
    const fileContent = await file.text();
    const fileSettings: Settings = fileContent
      ? JSON.parse(fileContent)
      : new Settings();

    this.organization = fileSettings.organization;
    this.project = fileSettings.project;
    this.repositories = fileSettings.repositories
      .map(repo => repo.trim())
      .join(', ');
  }
}
