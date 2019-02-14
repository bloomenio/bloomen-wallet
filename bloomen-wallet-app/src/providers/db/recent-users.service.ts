// Basic
import { Injectable } from '@angular/core';
import { NgForage } from 'ngforage';
import { from, Observable } from 'rxjs';

// Services
import { StorageService } from '@services/storage/storage.service';


// Config
import { recentUserConfig } from '@config/recent-user.config';
import { UserAlias } from '@core/models/recent-user.model';


@Injectable({ providedIn: 'root' })
export class RecentUsersService {

  private dappDatabase: NgForage;

  constructor(private storageService: StorageService) {
    this.dappDatabase = this.storageService.create(recentUserConfig.databaseConfig);
  }

  public get(key: string): Observable<UserAlias> {
    return from(this.storageService.get(this.dappDatabase, recentUserConfig.encryption, key));
  }

  public set(key: string, value: UserAlias): Observable<UserAlias> {
    return from(this.storageService.set(this.dappDatabase, recentUserConfig.encryption, key, value));
  }

  public remove(key: string): Observable<void> {
    return from(this.storageService.remove(this.dappDatabase, key));
  }


  public getAll(): Observable<UserAlias[]> {
    return from(this.storageService.getAll(this.dappDatabase, recentUserConfig.encryption));
  }

  public getAllAddresses(): Observable<string[]> {
    return from(this.dappDatabase.keys());
  }
}
