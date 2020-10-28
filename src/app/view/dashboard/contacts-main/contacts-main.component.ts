import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';
import { MatDialog } from '@angular/material/dialog';

import { ContactsApiService } from '@api-services/index';
import { ContactGetInterface } from '@models/index';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';

@Component({
  selector: 'app-contacts-main',
  templateUrl: './contacts-main.component.html',
  styleUrls: ['./contacts-main.component.scss']
})
export class ContactsMainComponent implements OnInit, OnDestroy {
  public contactList: ContactGetInterface[] = [];
  public dataSource: any = [];
  public displayedColumns: string[] = [
    'id', 'first_name', 'last_name', 'address', 'edit'];
  public pageSizeOptions = [20, 10, 50];
  public noDataFound = false;
  private destroy$ = new Subject<void>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private router: Router,
              private matDialog: MatDialog,
              private contactsApiService: ContactsApiService) {
  }

  ngOnInit(): void {
    this.getContactList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  /**
   * call getContactList method to get contacts
   * if contact List is not empty call setContactsTable method
   *
   * @return `null`
   */
  public getContactList(): void {
    this.contactsApiService.getContactList()
      .subscribe((contactList: ContactGetInterface[]) => {
        if (contactList.length) {
          this.contactList = contactList;
          this.setContactsTable();
        }
      });
  }

  /**
   * mat pagination init
   * mat sor init
   * @return `null`
   */
  public setContactsTable(): void {
    this.contactList.sort((a, b) => +(new Date(b.date)) - +(new Date(a.date)));

    this.dataSource = new MatTableDataSource<ContactGetInterface>(this.contactList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * calls from template
   * filter contact list
   *
   * @param event type `Event`
   *
   * @return `null`
   */
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.noDataFound = !this.dataSource.filteredData.length;
  }

  /**
   * calls from template
   * call removeContact method to remove contact
   * on success
   * - remove current contact form contactList array
   * - reset contacts table
   *
   * @param contactId type `string`
   *
   * @return `null`
   */
  public onRemoveContact(contactId: string): void {
    this.contactsApiService.removeContact(contactId)
      .subscribe((res) => {
        const index = this.contactList.findIndex(el => el.id === contactId);
        if (index > -1) {
          this.contactList.splice(index, 1);
          this.setContactsTable();
        }
      }, err => console.log('err', err));
  }

  /**
   * open CarItemDialogComponent modal
   * calls callInfoDialog modal if user send a request
   *
   * @param contact type `ContactGetInterface`
   *
   * @return `null`
   */
  public callContactDialog(contact: ContactGetInterface = null) {
    const dialogRef = this.matDialog.open(ContactDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: ['contact-item-dialog'],
      data: contact
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((newContact: ContactGetInterface) => {
        if (newContact) {
          this.contactList.push(newContact);
          this.setContactsTable();
        }
      });
  }
}
