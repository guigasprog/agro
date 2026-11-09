import { Injectable, signal } from "@angular/core";

// você pode retrair usando o toggle()
@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  readonly isExpanded = signal<boolean>(false);

  public toggle() {
    const actualValue = this.isExpanded();
    this.isExpanded.set(!actualValue);
  }
}
