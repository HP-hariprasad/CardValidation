import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PaymentValidation} from './paymentValidation.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('PaymentValidation', () => {
  let component: PaymentValidation;
  let fixture: ComponentFixture<PaymentValidation>;
  let compiled;
  let nameInput;
  let numberInput;
  let monthInput;
  let yearInput;
  let cvvInput;
  let nameInputError;
  let numberInputError;
  let monthInputError;
  let yearInputError;
  let cvvInputError;
  let submitButton;

  const pushInputValue = async (el, value) => {
    el.value = value;
    el.dispatchEvent(new Event('change'));
    el.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    await fixture.detectChanges();
  };

  const getByTestId = (testId: string) => {
    return compiled.querySelector(`[data-test-id="${testId}"]`);
  };

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          RouterTestingModule,
          FormsModule,
          ReactiveFormsModule
        ],
        declarations: [PaymentValidation],
        schemas : [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(PaymentValidation);
    fixture.autoDetectChanges(true);
    compiled = fixture.debugElement.nativeElement;
    component = fixture.componentInstance;

    await fixture.detectChanges();
    await fixture.whenStable();

    nameInput = getByTestId('name-input');
    numberInput = getByTestId('number-input');
    monthInput = getByTestId('month-input');
    yearInput = getByTestId('year-input');
    cvvInput = getByTestId('cvv-input');
    nameInputError = getByTestId('name-input-error');
    numberInputError = getByTestId('number-input-error');
    monthInputError = getByTestId('month-input-error');
    yearInputError = getByTestId('year-input-error');
    cvvInputError = getByTestId('cvv-input-error');
    submitButton = getByTestId('submit-button');
  });

  it('initial UI is rendered as expected', async() => {
    expect(nameInput.value).toBeFalsy();
    expect(numberInput.value).toBeFalsy();
    expect(monthInput.value).toBeFalsy();
    expect(yearInput.value).toBeFalsy();
    expect(cvvInput.value).toBeFalsy();
    expect(nameInputError).toBeFalsy();
    expect(numberInputError).toBeFalsy();
    expect(monthInputError).toBeFalsy();
    expect(yearInputError).toBeFalsy();
    expect(cvvInputError).toBeFalsy();
    expect(submitButton.disabled).toBeTruthy();
  });

  it('Validation that cardholder name is required works', async() => {
    await pushInputValue(nameInput, '');

    await fixture.detectChanges();
    await fixture.whenStable();

    nameInputError = getByTestId('name-input-error');
    submitButton = getByTestId('submit-button');
    expect(nameInputError.textContent.trim()).toBe('Invalid Cardholder Name');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('Validation that cardholder name contains alphabetic letters only works', async() => {
    await pushInputValue(nameInput, 'a123f');

    await fixture.detectChanges();
    await fixture.whenStable();

    nameInputError = getByTestId('name-input-error');
    submitButton = getByTestId('submit-button');
    expect(nameInputError.textContent.trim()).toBe('Invalid Cardholder Name');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('Validation that cardholder number is required works', async() => {
    await pushInputValue(numberInput, '');

    await fixture.detectChanges();
    await fixture.whenStable();

    numberInputError = getByTestId('number-input-error');
    submitButton = getByTestId('submit-button');
    expect(numberInputError.textContent.trim()).toBe('Invalid Card Number');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('Validation that cardholder number is 16 digit number works', async() => {
    await pushInputValue(numberInput, '111111111111111');

    await fixture.detectChanges();
    await fixture.whenStable();

    numberInputError = getByTestId('number-input-error');
    submitButton = getByTestId('submit-button');
    expect(numberInputError.textContent.trim()).toBe('Invalid Card Number');
    expect(submitButton.disabled).toBeTruthy();

    await pushInputValue(numberInput, '11011121191199999');

    await fixture.detectChanges();
    await fixture.whenStable();

    numberInputError = getByTestId('number-input-error');
    submitButton = getByTestId('submit-button');
    expect(numberInputError.textContent.trim()).toBe('Invalid Card Number');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('Validation that expiry month is required works', async() => {
    await pushInputValue(monthInput, '');

    await fixture.detectChanges();
    await fixture.whenStable();

    monthInputError = getByTestId('month-input-error');
    submitButton = getByTestId('submit-button');
    expect(monthInputError.textContent.trim()).toBe('Invalid Month');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('Validation that expiry month is a digit number from 1 to 12 works', async() => {
    await pushInputValue(monthInput, '1');

    await fixture.detectChanges();
    await fixture.whenStable();

    monthInputError = getByTestId('month-input-error');
    submitButton = getByTestId('submit-button');
    expect(monthInputError.textContent.trim()).toBe('Invalid Month');
    expect(submitButton.disabled).toBeTruthy();

    await pushInputValue(monthInput, '13');

    await fixture.detectChanges();
    await fixture.whenStable();

    monthInputError = getByTestId('month-input-error');
    submitButton = getByTestId('submit-button');
    expect(monthInputError.textContent.trim()).toBe('Invalid Month');
    expect(submitButton.disabled).toBeTruthy();

    await pushInputValue(monthInput, '000');

    await fixture.detectChanges();
    await fixture.whenStable();

    monthInputError = getByTestId('month-input-error');
    submitButton = getByTestId('submit-button');
    expect(monthInputError.textContent.trim()).toBe('Invalid Month');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('Validation that expiry year is required works', async() => {
    await pushInputValue(yearInput, '');

    await fixture.detectChanges();
    await fixture.whenStable();

    yearInputError = getByTestId('year-input-error');
    submitButton = getByTestId('submit-button');
    expect(yearInputError.textContent.trim()).toBe('Invalid Year');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('Validation that expiry year is a 4 digit year with max 3 years difference works', async() => {
    let yearInputValue = new Date().getFullYear() - 1;

    await pushInputValue(yearInput, yearInputValue);

    await fixture.detectChanges();
    await fixture.whenStable();

    yearInputError = getByTestId('year-input-error');
    submitButton = getByTestId('submit-button');
    expect(yearInputError.textContent.trim()).toBe('Invalid Year');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('Validation that cvv is required works', async() => {
    await pushInputValue(cvvInput, '');

    await fixture.detectChanges();
    await fixture.whenStable();

    cvvInputError = getByTestId('cvv-input-error');
    submitButton = getByTestId('submit-button');
    expect(cvvInputError.textContent.trim()).toBe('Invalid CVV/CVC');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('Validation that cvv is a 3 digit number works', async() => {
    await pushInputValue(cvvInput, '13');

    await fixture.detectChanges();
    await fixture.whenStable();

    cvvInputError = getByTestId('cvv-input-error');
    submitButton = getByTestId('submit-button');
    expect(cvvInputError.textContent.trim()).toBe('Invalid CVV/CVC');
    expect(submitButton.disabled).toBeTruthy();

    await pushInputValue(monthInput, '1345');

    await fixture.detectChanges();
    await fixture.whenStable();

    cvvInputError = getByTestId('cvv-input-error');
    submitButton = getByTestId('submit-button');
    expect(cvvInputError.textContent.trim()).toBe('Invalid CVV/CVC');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('Button should be enabled when all inputs are correct and no errors should be shown by performing series of operations', async() => {
    await pushInputValue(nameInput, 'John');
    await pushInputValue(numberInput, 1737491837491702);
    await pushInputValue(monthInput, 10);
    let yearInputValue = new Date().getFullYear() + 2;
    await pushInputValue(yearInput, yearInputValue);
    await pushInputValue(cvvInput, 123);

    await fixture.detectChanges();
    await fixture.whenStable();

    nameInputError = getByTestId('name-input-error');
    numberInputError = getByTestId('number-input-error');
    monthInputError = getByTestId('month-input-error');
    yearInputError = getByTestId('year-input-error');
    cvvInputError = getByTestId('cvv-input-error');
    submitButton = getByTestId('submit-button');

    expect(nameInputError).toBeFalsy();
    expect(numberInputError).toBeFalsy();
    expect(monthInputError).toBeFalsy();
    expect(yearInputError).toBeFalsy();
    expect(cvvInputError).toBeFalsy();
    expect(submitButton.disabled).toBeFalsy();

    await pushInputValue(nameInput, 'John123');
    await pushInputValue(numberInput, 17374918374917021);
    await pushInputValue(monthInput, 20);
    yearInputValue = new Date().getFullYear() - 2;
    await pushInputValue(yearInput, yearInputValue);
    await pushInputValue(cvvInput, 1234);

    await fixture.detectChanges();
    await fixture.whenStable();

    nameInputError = getByTestId('name-input-error');
    numberInputError = getByTestId('number-input-error');
    monthInputError = getByTestId('month-input-error');
    yearInputError = getByTestId('year-input-error');
    cvvInputError = getByTestId('cvv-input-error');
    submitButton = getByTestId('submit-button');

    expect(nameInputError.textContent.trim()).toBe('Invalid Cardholder Name');
    expect(numberInputError.textContent.trim()).toBe('Invalid Card Number');
    expect(monthInputError.textContent.trim()).toBe('Invalid Month');
    expect(yearInputError.textContent.trim()).toBe('Invalid Year');
    expect(cvvInputError.textContent.trim()).toBe('Invalid CVV/CVC');
    expect(submitButton.disabled).toBeTruthy();
  });
});
