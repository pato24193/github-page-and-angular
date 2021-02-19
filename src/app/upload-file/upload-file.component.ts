import {Component, Inject, OnInit} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {UploadFileService} from '../upload-file.service';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  selectedImage: any = null;
  url: string;
  id: string;
  file: string;

  constructor(@Inject(AngularFireStorage) private storage: AngularFireStorage,
              @Inject(UploadFileService) private uploadFileService: UploadFileService) {
  }

  ngOnInit() {
    this.uploadFileService.getImageDetailList();
  }

  showPreview(event: any) {
    this.selectedImage = event.target.files[0];
  }

  save() {
    const name = this.selectedImage.name;
    const fileRef = this.storage.ref(name);
    this.storage.upload(name, this.selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.url = url;
          this.uploadFileService.insertImageDetails(this.id, this.url);
          alert('Upload Successful');
        });
      })
    ).subscribe();
  }

  view() {
    this.uploadFileService.getImage(this.file);
  }

}
