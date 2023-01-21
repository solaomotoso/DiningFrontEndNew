import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Registration } from './registration.model';
import { RegistrationService } from './registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncrDecrService } from '../shared/EncrDecrService.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationForm!: FormGroup;
  registration: Registration=new Registration;
  errorMessage: string | undefined;
  pageTitle = 'New User';
  private validationMessages: { [key: string]: { [key: string]: string } };


  constructor(private fb: FormBuilder, private router: Router, private registrationservice: RegistrationService, private encdecservice:EncrDecrService) {

    // Defines all of the validation messages for the form.
    //These could instead be retrieved from a file or database.

    this.validationMessages = {
      firstName: {
        required: 'first name is required.',
        minlength: 'First name must be at least three characters.'
      },
      lastName: {
        required: 'last name is required.'
      },
      userName: {
        required: 'user name is required.'
      },
      password: {
        required: 'Password is required.'
      },

    };


   }

  ngOnInit(){
    this.registrationForm=this.fb.group({
      firstName:['',[Validators.required,Validators.minLength(3)]],
      lastName:['',[Validators.required,Validators.maxLength(50)]],
      userName:['',[Validators.required,Validators.maxLength(50)]],
      password:['',[Validators.required,Validators.maxLength(50)]],

    });
  }

  save(): void {
    // console.log(this.registrationForm);
    // console.log('Saved: ' + JSON.stringify(this.registrationForm.value));
    if (this.registrationForm.valid) {
     if (this.registrationForm.dirty) {
        const p = { ...this.registration, ...this.registrationForm.value };
        p.password=this.encdecservice.set('123456$#@$^@1ERF', p.password);
         if (p.id === 0) {
          if (confirm(`You are about creating account for user: ${p.firstName+' '+p.lastName}?`)) {
          this.registrationservice.createUser(p)
           .subscribe({
             next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
        }
        } else {
         this.registrationservice.updateUser(p)
         .subscribe({
           next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
           });
       }
      } else {
       this.onSaveComplete();
      }
     } else {
       this.errorMessage = 'Please correct the validation errors.';
     }
    }

onSaveComplete(): void {
  // this.registrationForm.reset();
  this.router.navigate(['/registrations']);
   }
 }


