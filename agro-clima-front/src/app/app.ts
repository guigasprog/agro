import { Component, inject } from '@angular/core';
import { SidebarComponent } from "../ui/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { LoginService } from '../login/login-service';
import { AreaAgricolaMapComponent } from '../area_agricola_map/area_agricola_map/area-agricola-map.component';
import { MapStateService } from './map-state.service';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, RouterOutlet, AreaAgricolaMapComponent],
  host: {
    class: 'flex flex-row gap-2 h-full p-4 bg-slate-950'
  },
  template: `
    @if (loginService.isLoggedIn()) {
      <app-sidebar />
    }
    <div class="flex-1 h-full overflow-hidden flex flex-row gap-2">
      <router-outlet />
      @if (loginService.isLoggedIn() && mapState.showMap()) {
        <app-area-agricola-map class="flex-1 rounded-xl overflow-hidden border border-white/10 order-2" />
      }
    </div>
  `
})
export class App {
    readonly loginService = inject(LoginService);
    readonly mapState = inject(MapStateService);
}
