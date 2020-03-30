import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { NotificationsService } from '../../services/notifications.service';
import { C } from '../../constants/constants';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.page.html',
  styleUrls: ['./reminder.page.scss'],
})
export class ReminderPage implements OnInit {

  constructor(
    private http: HttpClient, private fb: FormBuilder, private toastCtrl: ToastController,
    private notificationsService: NotificationsService) {//
  }

  name = '';
  mail = '';
  phone = '';
  errorMsg = 'טעות בנתונים';
  error = true;
  done = false;
  nameError = false;
  remiderForm: FormGroup;
  formInvalid = false;
  loading = false;

  formErrors = {
    name: '',
    mail: '',
    phone: ''
  };

  validationMessages = {
    /* 'firstName': {
      'required': this.tService.getTranslatedText('Please Enter First Name'),
      'maxlength': this.tService.getTranslatedText('max ') + this.nameMaxLength + this.tService.getTranslatedText(' characters'),
    },
    'lastName': {
      'required': this.tService.getTranslatedText('Please Enter Last Name'),
      'maxlength': this.tService.getTranslatedText('max ') + this.nameMaxLength + this.tService.getTranslatedText(' characters'),
    }, */
    name: {
      required: 'נא להזין שם',
      maxlength: 'מקסימום 30 תווים',
    },
    mail: {
      required: 'נא להזין כתובת דואר אלקטרוני',
      email: 'נא להזין כתובת דואל תקינה',
      // 'maxlength': this.tService.getTranslatedText('max ') + this.emailMaxLength + this.tService.getTranslatedText(' characters'),
    },
    phone: {
      required: 'נא להזין מספר טלפון',
      // 'pattern': 'נא להזין ספרות בלבד',
      minlength: 'מינימום 9 ספרות',
      incorrect: 'נא להזין מספר טלפון תקין'
      // 'maxlength': this.tService.getTranslatedText('max ') + this.passwordMaxLength + this.tService.getTranslatedText(' characters'),
      // 'minlength': this.tService.getTranslatedText('min 6 characters'),
      // 'pattern': this.tService.getTranslatedText('At least one letter and one number'),
    }
  };

  ngOnInit(): void {
    if (localStorage.getItem(C.localSofrimNextYearReminder)) { this.done = true; }
    console.log('this.done', this.done);
    this.buildForm();
  }

  buildForm() {
    this.remiderForm = this.fb.group({
      name: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(9)]]
    });

    this.remiderForm.valueChanges.subscribe(data => this.onValueChanged(this.remiderForm, data));

    this.onValueChanged(this.remiderForm); // (re)set validation messages now

  }

  onValueChanged(form: any, data?: any) {
    if (!form) { return; }
    // const form = this.signUpForm;
    let invalidCount = 0;
    this.errorMsg = '';
    this.error = false;
    // console.log(form.controls);
    for (const control in form.controls) {
      if (form.controls.hasOwnProperty(control)) {
        const controlName = form.get(control);
        // console.log(control);
        if (controlName && controlName.dirty && controlName.invalid) {
          invalidCount++;
          // this.formErrors[control] = '';
          const messages = this.validationMessages[control];
          for (const key in controlName.errors) {
            if (controlName.errors.hasOwnProperty(key)) {
              this.formErrors[control] = messages[key] + ' ';
            }
          }
          this.error = true;
        }
        if (controlName && controlName.dirty && controlName.valid) {
          this.formErrors[control] = '';
        }
        if (controlName && !controlName.dirty) {
          invalidCount++;
        }
      }
    }
    (invalidCount > 0) ? this.formInvalid = true : this.formInvalid = false;
    this.name = this.remiderForm.get('name').value;
    this.mail = this.remiderForm.get('mail').value;
    this.phone = this.remiderForm.get('phone').value;
    // console.log(invalidCount);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReminderPage');
  }

  validateName() {
    if (this.name === '') { this.nameError = true; }
  }

  validatePhone() {
    const r = /[^0-9]/gi;
    const a = this.phone.replace(r, '');
    return a;
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  send() {
    this.loading = true;
    console.log(this.validatePhone());
    console.log(this.name);
    console.log(this.mail);
    console.log(this.phone);
    const body = {
      name: this.name,
      mail: this.mail,
      phone: this.phone
    };
    const stringBody = JSON.stringify(body);
    this.http.post('https://us-central1-hello-world-3a8b8.cloudfunctions.net/saveNextYearReminder', stringBody)
      .pipe(retry(2))
      .subscribe((res: any) => {
        if (res) { // .status === 200
          const key = res;
          this.notificationsService.removeNextYearNotifications();
          localStorage.setItem(C.localSofrimNextYearReminder, key);
          setTimeout(() => {
            this.loading = false;
            this.done = true;
          }, 100);
        } else {
          this.checkForErrors(res);
        }
        console.log(res);
      }, e => {
        console.log(e);
        this.checkForErrors(e);
        // console.log(e.status);
        // })
      });
  }

  checkForErrors(e) {
    this.loading = false;
    setTimeout(() => {
      switch (e.status) {
        case 440:
          this.remiderForm.controls.phone.setErrors({ incorrect: true });
          this.formErrors.phone = this.validationMessages.phone.incorrect;
          this.remiderForm.controls.phone.markAsTouched();
          break;
        case 430:
          this.remiderForm.controls.mail.setErrors({ email: true });
          this.formErrors.mail = this.validationMessages.mail.email;
          this.remiderForm.controls.mail.markAsTouched();
          break;
        case 420:
          this.remiderForm.controls.name.setErrors({ required: true });
          this.formErrors.name = this.validationMessages.name.required;
          this.remiderForm.controls.name.markAsTouched();
          break;
        default:
          this.errorMsg = 'תקלה בהעברת הנתונים ניתן לנסות שוב מאוחר יותר';
          break;
      }
      // this.zone.run(() => {
      console.log(this.formErrors.phone);
      this.formInvalid = true;
      this.error = true;
      // this.ref.detectChanges();
    }, 100);
  }

  sendRemove() {
    this.loading = true;
    this.error = false;
    const phone = localStorage.getItem(C.localSofrimNextYearReminder);
    const body = {
      phone
    };
    const stringBody = JSON.stringify(body);
    this.http.post('https://us-central1-hello-world-3a8b8.cloudfunctions.net/removeNextYearReminder', stringBody, { responseType: 'text'})
      .subscribe(async (res: any) => {
        if (res) { // .status === 200
          // const key = res._body;
          localStorage.removeItem(C.localSofrimNextYearReminder);
          const toast = await this.toastCtrl.create({
            message: 'הוסר בהצלחה',
            duration: 3000,
            position: 'top',
            cssClass: 'toast'
          });
          toast.present();
          // setTimeout(() => {
          // this.zone.run(() => {

          setTimeout(() => {
            this.loading = false;
            this.done = false;
          }, 100);
          // });
        }
        console.log(res);
      }, e => {
        console.log(e);
        // this.zone.run(() => {
        setTimeout(() => {
          this.loading = false;
          this.error = true;
          this.errorMsg = 'תקלה בהסרת הרישום, נא לנסות מאוחר יותר';
        }, 100);
        // })
        // console.log(e.status);
        // this.error = true;
      });
  }

}
