import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'redirect';

  constructor() { }

  public ngOnInit() {
    window.location.href = 'https://' + window.location.hostname + '/tienda/#/';
  }
}
