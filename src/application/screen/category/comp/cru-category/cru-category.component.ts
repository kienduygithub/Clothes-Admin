import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { CategoryManagement } from "../../../../data/management/category.management";
import { CategoryService } from "../../../../data/service/category.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NbDialogService } from "@nebular/theme";

@Component({
    standalone: true,
    selector: 'cru-category-component',
    templateUrl: './cru-category.component.html',
    styleUrl: './cru-category.component.scss',
    imports: [
        CommonModule,
    ],
    providers: [
        CategoryManagement,
        CategoryService
    ]
})

export class CRUCategoryComponent implements OnInit {

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private dialogService: NbDialogService,
        private categoryManagement: CategoryManagement
    ) { }

    async ngOnInit() {

    }
}