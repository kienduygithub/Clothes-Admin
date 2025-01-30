import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ImageResource } from '../../../resource/image_resource';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-success',
  templateUrl: './warnimg.component.html',
  styleUrl: './warnimg.component.css',
  standalone: true,
  imports: [TranslateModule],
})
export class WarningComponent {
  title: string = '';
  content: string = '';
  icon_alert = ImageResource.icon_alert;
  acceptFunc: Function = () => { };

  constructor(protected ref: NbDialogRef<WarningComponent>) {}

  close() {
    this.ref.close(false);
  }
  onAccept() {
    this.acceptFunc();
    this.ref.close(true)
  }

}
