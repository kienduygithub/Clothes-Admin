import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { ImageResource } from '../../../resource/image_resource';

@Component({
  selector: 'avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css',
})
export class AvatarComponent {
  @Input() imagePath: string = '';
  @Input() title: string = '';
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() nameSize: number = 0;
  @Output() logoURL = new EventEmitter();
  imageURL: string = '';
  edit_logo = ImageResource.edit_logo;
  imageName: string = '';

  constructor(private dialogService: NbDialogService) {}

  ngOnInit(): void {
    this.imagePath = this.imagePath;
  }

  async reduceSizeImage(file: any) {
    let quality = 1;
    if (file.size <= 80 * 1024) {
      return file;
    } else {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = async (event) => {
          const img = new Image();
          img.onload = async () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (img.width > 1000) {
              var newWidth = 1000;
              var aspectRatio = newWidth / img.width;
              var newHeight = img.height * aspectRatio;

              canvas.width = newWidth;
              canvas.height = newHeight;
              ctx?.drawImage(img, 0, 0, newWidth, newHeight);
            } else {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
            const compress = (quality: number) => {
              return new Promise((resolve) => {
                canvas.toBlob(
                  (blob: any) => {
                    if (blob.size <= 80 * 1024) {
                      resolve(
                        new File([blob], file.name, {
                          type: 'image/jpeg',
                          lastModified: Date.now(),
                        })
                      );
                    } else {
                      resolve(compress(quality - 0.1));
                    }
                  },
                  'image/jpeg',
                  quality
                );
              });
            };
            resolve(compress(quality));
          };
          img.src = event?.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    }
  }

  getFirstChar(name: string) {
    return name?.charAt(0).toUpperCase();
  }

  getColor(id: string) {
    let num = parseInt(id?.slice(id.length - 3, id.length));
    switch (num % 10) {
      case 0:
        return '#0085FF';
      case 1:
        return '#b0bbcf';
      case 2:
        return '#8b8b8c';
      case 3:
        return '#b388ae';
      case 4:
        return '#db48ca';
      case 5:
        return '#a89ba1';
      case 6:
        return '#90ba5f';
      case 7:
        return '#524f57';
      case 8:
        return '#8e9415';
      case 9:
        return '#dade85';
      default:
        return '#b388ae';
    }
  }
}
