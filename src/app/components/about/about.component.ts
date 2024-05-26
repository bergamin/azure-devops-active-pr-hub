import { Component } from '@angular/core';
import { app } from '../../utils/constants.utils';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  version = app.version;
}
