import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Router } from "@angular/router";
import { NbButtonModule } from "@nebular/theme";
import { CategoryUrl } from "./category.routing";
import { CategoryListComponent } from "./category-list/category-list.component";

const NB_LIBS = [
    NbButtonModule
]

@Component({
    standalone: true,
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss',
    imports: [
        ...NB_LIBS,
        CommonModule,
        CategoryListComponent
    ],
    providers: [

    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CategoryComponent {

    constructor(
        private router: Router
    ) { }

    onCreate() {
        this.router.navigate([CategoryUrl.VIEW_CATEGORY_URL]);
    }
}