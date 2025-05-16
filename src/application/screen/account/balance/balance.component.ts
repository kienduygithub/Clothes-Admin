import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { NbButtonModule, NbDialogModule, NbIconModule, NbInputModule, NbSelectModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ShopManagement } from '../../../data/management/shop.management';
import { ShopService } from '../../../data/service/shop.service';
import { ImageResource } from '../../../common/resource/image_resource';

const NB_LIBS = [
    NbTooltipModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbDialogModule,
    NbIconModule
]

const ANGULAR_MODULE = [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
]

const PROVIDERS = [
    ShopManagement,
    ShopService
]

@Component({
    standalone: true,
    selector: 'app-balance-account',
    templateUrl: './balance.component.html',
    styleUrls: ['./balance.component.scss'],
    imports: [...NB_LIBS, ...ANGULAR_MODULE],
    providers: [...PROVIDERS],
})
export class BalanceComponent implements OnInit {
    icon_camera_upload: string = ImageResource.icon_camera_upload;
    image_upload_person: string = ImageResource.image_upload_person;

    constructor(
        private fb: FormBuilder,
        private shopMana: ShopManagement
    ) { }

    async ngOnInit() {
        await this.fetchData();
    }

    async fetchData() {
        try {
        } catch (error) {
            console.log(error);
        }
    }

}
