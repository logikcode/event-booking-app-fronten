import {FormGroup} from "@angular/forms";

export interface EventDetailPojo{
  file?: UploadedFile[],
  form?: FormGroup;
}

interface UploadedFile {
  fileName: String;
  fileType: String;
  fileSize: String;
  fileData64: String;
}
