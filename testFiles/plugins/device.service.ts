import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Device, DeviceInfo } from '@capacitor/device';
import { Observable, forkJoin, from, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  public deviceInfo: DeviceInfo;
  private uuid: string;
  private appVersion: string;
  private appBuild: string;

  constructor() {
  }

  public init(): Observable<void> {
    if (Capacitor.isNativePlatform() && Device) {
      return forkJoin({
        info: from(Device.getInfo()),
        id: from(Device.getId()),
        appInfo: from(App.getInfo()),
      }).pipe(
        map((result) => {
          this.deviceInfo = result.info;
          this.uuid = result.id?.uuid;
          this.appVersion = result.appInfo?.version;
          this.appBuild = result.appInfo?.build;
        }),
      );
    }
    return of(null);
  }

  public getBuildNumber(): string {
    return this.appBuild;
  }

  public getAppVersion(): string {
    return this.appVersion;
  }

  public getDeviceUUID(): string {
    return this.uuid;
  }
}
