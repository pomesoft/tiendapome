import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PwaUpdateService {

    updateSubscription;

    constructor(public updates: SwUpdate) {

    }

    public checkForUpdates(): void {

        console.log('PwaUpdateService.checkForUpdates()');

        this.updateSubscription = this.updates.available.subscribe(event => this.promptUser());
        //console.log('this.updateSubscription', this.updateSubscription);

        console.log('this.updates.isEnabled', this.updates.isEnabled);

        if (this.updates.isEnabled) {                      
            
            // Required to enable updates on Windows and ios.
            this.updates.activateUpdate();
            //interval(1 * 60 * 60 * 1000) => cada 1 hora
            //interval(10 * 60 * 60 * 1000) => cada 10 horas
            let intervaloTiempo: number = 6000;
            console.log('interval(intervaloTiempo)', intervaloTiempo);
            interval(intervaloTiempo).subscribe(() => {                
                this.updates.checkForUpdate().then(() => {
                    console.log('checking for updates');
                    console.log('this.updates', this.updates);
                    
                });
            });

        }
    }

    promptUser(): void {
        this.updates.activateUpdate().then(() => {
            console.log('this.updates.activateUpdate()');
            if (confirm("New version available. Load New Version?")) {
                window.location.reload();
            }
        });
    }
}