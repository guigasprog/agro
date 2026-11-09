import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapStateService {
  readonly showMap = signal(true);

  hideMap() {
    this.showMap.set(false);
  }

  displayMap() {
    this.showMap.set(true);
  }
}
