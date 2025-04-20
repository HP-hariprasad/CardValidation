import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { formatCardNumber, formatExpiryDate } from "./utils";

@Component({
  selector: 'payment-validation',
  templateUrl: './paymentValidation.component.html',
  styleUrls: ['./paymentValidation.component.scss']
})
export class PaymentValidation implements OnInit {
  cardForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 3;

    this.cardForm = this.fb.group({
      number: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]], 
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]], 
      month: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]], 
      year: ['', [
        Validators.required,
        Validators.pattern(/^\d{4}$/),
        control => {
          const year = parseInt(control.value, 10);
          if (isNaN(year) || year < currentYear || year > maxYear) {
            return { range: true }; 
          }
          return null;
        }
      ]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]] 
    });
  }

  isFormValidAndTouched(): boolean {
    return this.cardForm.valid && Object.values(this.cardForm.controls).every(control => control.touched || control.dirty);
  }

  getFormattedValue(controlName: string, formatter: (value: string) => string): string {
    const control = this.cardForm.controls[controlName];
    return formatter(control.value);
  }

  get cardNumber() {
    return this.getFormattedValue('number', value => formatCardNumber(Number(value)));
  }

  get cardExpiryMonth() {
    return this.getFormattedValue('month', value => formatExpiryDate(Number(value)));
  }

  get cardExpiryYear() {
    return this.getFormattedValue('year', value => formatExpiryDate(Number(value)));
  }

  get cardHolderName() {
    return this.cardForm.controls['name'].value || 'Card Holder Name';
  }

  getErrorMessage(controlName: string, errorMessages: { [key: string]: string }): string | null {
    const control = this.cardForm.get(controlName);
    if (!control) return null;

    for (const errorKey in errorMessages) {
      if (control.hasError(errorKey)) {
        return errorMessages[errorKey];
      }
    }
    return null;
  }

  get cardNumberError(): string | null {
    return this.getErrorMessage('number', {
      required: 'Invalid Card Number',
      pattern: 'Invalid Card Number'
    });
  }

  get cardHolderNameError(): string | null {
    return this.getErrorMessage('name', {
      required: 'Invalid Cardholder Name',
      pattern: 'Invalid Cardholder Name'
    });
  }

  get cardExpiryMonthError(): string | null {
    return this.getErrorMessage('month', {
      required: 'Invalid Month',
      pattern: 'Invalid Month'
    });
  }

  get cardExpiryYearError(): string | null {
    return this.getErrorMessage('year', {
      required: 'Invalid Year',
      pattern: 'Invalid Year',
      range: 'Invalid Year'
    });
  }

  get cardCVVError(): string | null {
    return this.getErrorMessage('cvv', {
      required: 'Invalid CVV/CVC',
      pattern: 'Invalid CVV/CVC'
    });
  }
}
