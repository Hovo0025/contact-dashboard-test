import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@env';
import {
  ContactGetInterface,
  ContactSaveInterface
} from '@models/index';

@Injectable({
  providedIn: 'root'
})
export class ContactsApiService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  /**
   * HTTP GET Request for get contacts list
   *
   * @return
   *
   * - `Observable<ContactGetInterface[]>`
   */
  public getContactList() {
    const endpoint = '/contacts/';
    return this.http.get<ContactGetInterface[]>(`${this.baseUrl}${endpoint}`);
  }

  /**
   * HTTP GET Request for get contacts item
   *
   * @param contactId type `string`
   *
   * @return
   *
   * - `Observable<ContactGetInterface>`
   */
  public getContact(contactId: string) {
    const endpoint = '/contacts/';
    return this.http.get<ContactGetInterface>(`${this.baseUrl}${endpoint}/${contactId}`);
  }

  /**
   * HTTP POST Request for add contact
   *
   * @param requestData type `ContactSaveInterface`
   *
   * @return
   *
   * - `Observable<ContactGetInterface[]>`
   */
  public addContact(requestData: ContactSaveInterface) {
    const endpoint = '/contacts/';
    return this.http.post<ContactGetInterface>(`${this.baseUrl}${endpoint}`, requestData);
  }

  /**
   * HTTP PUT Request for edit contact
   *
   * @param requestData type `ContactSaveInterface`
   *
   * @return
   *
   * - `Observable<ContactGetInterface[]>`
   */
  public editContact(requestData: ContactSaveInterface) {
    const endpoint = '/contacts/';
    return this.http.put<ContactGetInterface>(`${this.baseUrl}${endpoint}/${requestData.id}`, requestData);
  }

  /**
   * HTTP DELETE Request for remove contact
   *
   * @param id type `string`
   *
   * @return
   *
   * - `Observable<{}>`
   */
  public removeContact(id: string) {
    const endpoint = '/contacts/';
    return this.http.delete<{}>(`${this.baseUrl}${endpoint}/${id}`);
  }
}
