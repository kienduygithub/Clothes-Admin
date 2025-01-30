import { Component } from '@angular/core';
import { ImageResource } from '../../../../common/resource/image_resource';
import { NbDialogRef } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorModel } from '../../../model/error';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  title: string = ""
  content: string = ""
  error: ErrorModel = new ErrorModel()
  icon_alert = ImageResource.alert_circle;

  constructor(protected ref: NbDialogRef<ErrorComponent>) { }

  close() {
    this.ref.close(false)
  }


}
