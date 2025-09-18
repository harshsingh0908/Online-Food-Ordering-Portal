import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiLoadingService {
  startLoading(): void {
    // Implement real UI loading indicator if needed
    console.log('Loading started');
  }
  stopLoading(): void {
    // Implement real UI loading indicator if needed
    console.log('Loading stopped');
  }
}
