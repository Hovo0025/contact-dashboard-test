import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { FormErrorStateMatcher } from '@helpers/form-error-state-matcher';
import { ContactsApiService } from '@api-services/contacts-api.service';
import { ContactGetInterface } from '@models/contacts/contact-get.interface';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss']
})
export class ContactDialogComponent implements OnInit {
  public saveContactForm: FormGroup;
  public matcher = new FormErrorStateMatcher();
  public contactId: string;
  public contactItem: ContactGetInterface;
  public editMode = false;

  constructor(private fBuilder: FormBuilder,
              private contactsApiService: ContactsApiService,
              public dialogRef: MatDialogRef<ContactDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ContactGetInterface) {
    if (this.data) {
      this.editMode = true;
      this.contactItem = this.data;
    }
  }

  ngOnInit() {
    this.initForm();
    if (this.editMode) {
      this.setForm();
    }
  }

  /**
   * calls from template
   * call method to save/edit contact item
   * on success
   * - close dialog
   *
   * @return `null`
   */
  public onSaveContact(): void {
    if (this.saveContactForm.invalid) {
      return;
    }
    const requestData = {
      id: (this.contactItem && this.contactItem.id) ? this.contactItem.id : uuidv4(),
      first_name: this.saveContactForm.value.firstName,
      last_name: this.saveContactForm.value.lastName,
      address: this.saveContactForm.value.address,
      date: new Date()
    };
    let saveObs: Observable<ContactGetInterface>;
    if (!this.editMode) {
      saveObs = this.contactsApiService.addContact(requestData);
    } else {
      saveObs = this.contactsApiService.editContact(requestData);
    }

    saveObs.subscribe((res: ContactGetInterface) => {
      this.dialogRef.close(requestData);
    }, err => console.log('err', err));
  }

  /**
   * saveContactForm initialization
   *
   * @return `null`
   */
  public initForm(): void {
    this.saveContactForm = this.fBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['']
    });
  }

  /**
   * calls when editMode === true
   * patch value to form controls
   *
   * @return `null`
   */
  public setForm(): void {
    this.saveContactForm.patchValue({
      firstName: (this.contactItem.first_name) ? this.contactItem.first_name : '',
      lastName: (this.contactItem.last_name) ? this.contactItem.last_name : '',
      address: (this.contactItem.address) ? this.contactItem.address : ''
    });
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
