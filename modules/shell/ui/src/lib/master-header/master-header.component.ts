import { Component } from '@angular/core';
import { StartHeaderComponent } from "../start-header/start-header.component";
import { CenterHeaderComponent } from "../center-header/center-header.component";
import { EndHeaderComponent } from "../end-header/end-header.component";

@Component({
  selector: 'ay-master-header',
  templateUrl: './master-header.component.html',
  styleUrls: ['./master-header.component.scss'],
  standalone: true,
  imports: [StartHeaderComponent, CenterHeaderComponent, EndHeaderComponent]
})
export class MasterHeaderComponent {}
