import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from "@angular/core";
import {
    Autoformat,
    AutoImage,
    Autosave,
    BlockQuote,
    Bold,
    Essentials,
    Heading,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    LinkImage,
    List,
    ListProperties,
    Paragraph,
    PictureEditing,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    Underline
} from 'ckeditor5';
import { environment } from "../../../../environments/environment";
import { CommonModule } from "@angular/common";
import { FormGroup, FormsModule } from "@angular/forms";

import { loadCKEditorCloud, CKEditorModule, type CKEditorCloudResult, type CKEditorCloudConfig } from '@ckeditor/ckeditor5-angular';

import { ClassicEditor, EditorConfig } from 'https://cdn.ckeditor.com/typings/ckeditor5.d.ts';

@Component({
    standalone: true,
    selector: 'app-ckeditor',
    templateUrl: './ckeditor.component.html',
    styleUrl: './ckeditor.component.scss',
    imports: [
        CommonModule,
        CKEditorModule,
        FormsModule
    ],
    providers: [

    ]
})

export class CKEditorComponent implements OnInit, AfterViewInit {

    @Input() placeholder: string = '';
    @Input() group!: FormGroup;
    @Input() controlName!: string;

    isLayoutReady = false;
    LICENSE_KEY =
        'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NzIzMjMxOTksImp0aSI6IjQ1OTkwOGE2LTIxODItNDgyOS04NWNkLTk4MDYxYWZhMWM1ZCIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIiwiQk9YIl0sInZjIjoiODNhMDc5NDIifQ.qjlLFiUunn6pLQvUbafPFhf6evz1dXdFjzJf4UKxUnYAPB3biBERayyLibEQxbBnBARxZ03nVWWCOuFW81FVdQ';

    cloudConfig = {
        version: '44.2.1'
    } satisfies CKEditorCloudConfig;
    public Editor: typeof ClassicEditor | null = null;
    public config: EditorConfig | null = null;

    editorData = '';

    constructor(
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        loadCKEditorCloud(this.cloudConfig).then(this._setupEditor.bind(this));
    }

    ngAfterViewInit(): void {
        // this.config = {
        //     toolbar: {
        //         items: [
        //             'heading',
        //             '|',
        //             'bold',
        //             'italic',
        //             'underline',
        //             '|',
        //             // 'insertImage',
        //             'insertTable',
        //             '|',
        //             'bulletedList',
        //             'numberedList',
        //             'outdent',
        //             'indent'
        //         ],
        //         shouldNotGroupWhenFull: false
        //     },
        //     plugins: [
        //         Autoformat,
        //         AutoImage,
        //         Autosave,
        //         BlockQuote,
        //         Bold,
        //         Essentials,
        //         Heading,
        //         ImageBlock,
        //         ImageCaption,
        //         ImageInline,
        //         ImageInsert,
        //         ImageInsertViaUrl,
        //         ImageResize,
        //         ImageStyle,
        //         ImageTextAlternative,
        //         ImageToolbar,
        //         ImageUpload,
        //         Indent,
        //         IndentBlock,
        //         Italic,
        //         LinkImage,
        //         List,
        //         ListProperties,
        //         Paragraph,
        //         PictureEditing,
        //         Table,
        //         TableCaption,
        //         TableCellProperties,
        //         TableColumnResize,
        //         TableProperties,
        //         TableToolbar,
        //         TextTransformation,
        //         Underline
        //     ],
        //     heading: {
        //         options: [
        //             {
        //                 model: 'paragraph',
        //                 title: 'Paragraph',
        //                 class: 'ck-heading_paragraph'
        //             },
        //             {
        //                 model: 'heading1',
        //                 view: 'h1',
        //                 title: 'Heading 1',
        //                 class: 'ck-heading_heading1'
        //             },
        //             {
        //                 model: 'heading2',
        //                 view: 'h2',
        //                 title: 'Heading 2',
        //                 class: 'ck-heading_heading2'
        //             },
        //             {
        //                 model: 'heading3',
        //                 view: 'h3',
        //                 title: 'Heading 3',
        //                 class: 'ck-heading_heading3'
        //             },
        //             {
        //                 model: 'heading4',
        //                 view: 'h4',
        //                 title: 'Heading 4',
        //                 class: 'ck-heading_heading4'
        //             },
        //             {
        //                 model: 'heading5',
        //                 view: 'h5',
        //                 title: 'Heading 5',
        //                 class: 'ck-heading_heading5'
        //             },
        //             {
        //                 model: 'heading6',
        //                 view: 'h6',
        //                 title: 'Heading 6',
        //                 class: 'ck-heading_heading6'
        //             }
        //         ]
        //     },
        //     image: {
        //         toolbar: [
        //             'toggleImageCaption',
        //             'imageTextAlternative',
        //             '|',
        //             'imageStyle:inline',
        //             'imageStyle:wrapText',
        //             'imageStyle:breakText',
        //             '|',
        //             'resizeImage',
        //         ]
        //     },
        //     initialData: '',
        //     licenseKey: environment.LICENSE_KEY,
        //     list: {
        //         properties: {
        //             styles: true,
        //             startIndex: true,
        //             reversed: true
        //         }
        //     },
        //     placeholder: this.placeholder,
        //     table: {
        //         contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        //     }
        // };
        // configUpdateAlert(this.config);

        this.isLayoutReady = true;

        if (this.group && this.controlName) {
            const html = this.group.get(this.controlName)?.value;
            this.editorData = html;
        }
        this.cdr.detectChanges();
    }

    onChangeEditor(event: any) {
        const content = event.editor.getData();
        if (this.group && this.controlName) {
            this.group.get(this.controlName)?.patchValue(
                content,
                { emitEvent: false }
            )
        }
    }

    private _setupEditor(cloud: CKEditorCloudResult<typeof this.cloudConfig>) {
        const {
            ClassicEditor,
            Autoformat,
            AutoImage,
            Autosave,
            BlockQuote,
            Bold,
            CloudServices,
            Essentials,
            Heading,
            ImageBlock,
            ImageCaption,
            ImageInline,
            ImageInsertViaUrl,
            ImageResize,
            ImageStyle,
            ImageTextAlternative,
            ImageToolbar,
            ImageUpload,
            Indent,
            IndentBlock,
            Italic,
            Link,
            LinkImage,
            List,
            ListProperties,
            MediaEmbed,
            Mention,
            Paragraph,
            PasteFromOffice,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TextTransformation,
            TodoList,
            Underline
        } = cloud.CKEditor;

        this.Editor = ClassicEditor;
        this.config = {
            toolbar: {
                items: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'underline',
                    '|',
                    'emoji',
                    'link',
                    'mediaEmbed',
                    'insertTable',
                    'blockQuote',
                    '|',
                    'bulletedList',
                    'numberedList',
                    'todoList',
                    'outdent',
                    'indent'
                ],
                shouldNotGroupWhenFull: false
            },
            plugins: [
                Autoformat,
                AutoImage,
                Autosave,
                BlockQuote,
                Bold,
                CloudServices,
                Essentials,
                Heading,
                ImageBlock,
                ImageCaption,
                ImageInline,
                ImageInsertViaUrl,
                ImageResize,
                ImageStyle,
                ImageTextAlternative,
                ImageToolbar,
                ImageUpload,
                Indent,
                IndentBlock,
                Italic,
                Link,
                LinkImage,
                List,
                ListProperties,
                MediaEmbed,
                Mention,
                Paragraph,
                PasteFromOffice,
                Table,
                TableCaption,
                TableCellProperties,
                TableColumnResize,
                TableProperties,
                TableToolbar,
                TextTransformation,
                TodoList,
                Underline
            ],
            heading: {
                options: [
                    {
                        model: 'paragraph',
                        title: 'Paragraph',
                        class: 'ck-heading_paragraph'
                    },
                    {
                        model: 'heading1',
                        view: 'h1',
                        title: 'Heading 1',
                        class: 'ck-heading_heading1'
                    },
                    {
                        model: 'heading2',
                        view: 'h2',
                        title: 'Heading 2',
                        class: 'ck-heading_heading2'
                    },
                    {
                        model: 'heading3',
                        view: 'h3',
                        title: 'Heading 3',
                        class: 'ck-heading_heading3'
                    },
                    {
                        model: 'heading4',
                        view: 'h4',
                        title: 'Heading 4',
                        class: 'ck-heading_heading4'
                    },
                    {
                        model: 'heading5',
                        view: 'h5',
                        title: 'Heading 5',
                        class: 'ck-heading_heading5'
                    },
                    {
                        model: 'heading6',
                        view: 'h6',
                        title: 'Heading 6',
                        class: 'ck-heading_heading6'
                    }
                ]
            },
            image: {
                toolbar: [
                    'toggleImageCaption',
                    'imageTextAlternative',
                    '|',
                    'imageStyle:inline',
                    'imageStyle:wrapText',
                    'imageStyle:breakText',
                    '|',
                    'resizeImage'
                ]
            },
            initialData: this.editorData,
            licenseKey: this.LICENSE_KEY,
            link: {
                addTargetToExternalLinks: true,
                defaultProtocol: 'https://',
                decorators: {
                    toggleDownloadable: {
                        mode: 'manual',
                        label: 'Downloadable',
                        attributes: {
                            download: 'file'
                        }
                    }
                }
            },
            list: {
                properties: {
                    styles: true,
                    startIndex: true,
                    reversed: true
                }
            },
            mention: {
                feeds: [
                    {
                        marker: '@',
                        feed: [
                            /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
                        ]
                    }
                ]
            },
            placeholder: 'Type or paste your content here!',
            table: {
                contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
            }
        };
    }
}

// function configUpdateAlert(config: any) {
//     if ((configUpdateAlert as any).configUpdateAlertShown) {
//         return;
//     }

//     const isModifiedByUser = (currentValue: string | undefined, forbiddenValue: string) => {
//         if (currentValue === forbiddenValue) {
//             return false;
//         }

//         if (currentValue === undefined) {
//             return false;
//         }

//         return true;
//     };

//     // const valuesToUpdate = [];

//     (configUpdateAlert as any).configUpdateAlertShown = true;

//     // if (!isModifiedByUser(config.cloudServices?.tokenUrl, '<YOUR_CLOUD_SERVICES_TOKEN_URL>')) {
//     //     valuesToUpdate.push('CLOUD_SERVICES_TOKEN_URL');
//     // }

//     // if (valuesToUpdate.length) {
//     //     window.alert(
//     //         [
//     //             'Please update the following values in your editor config',
//     //             'to receive full access to Premium Features:',
//     //             '',
//     //             ...valuesToUpdate.map(value => ` - ${value}`)
//     //         ].join('\n')
//     //     );
//     // }
// }

