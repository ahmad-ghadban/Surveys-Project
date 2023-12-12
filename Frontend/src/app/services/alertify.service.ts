import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root',
})
// this whole file is unneccessary
export class AlertifyService {
  constructor() {}

  success(message: string) {
    alertify.success(message);
  }

  warning(message: string) {
    alertify.warning(message);
  }

  error(message: string) {
    alertify.error(message);
  }

  alert(message: string) {
    alertify.alert('URL To Share', message, function () {
      navigator.clipboard.writeText(message);
      alertify.message('Copied to clipboard');
    });
  }
}
