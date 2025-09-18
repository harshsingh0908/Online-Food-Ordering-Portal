import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  success(message: string): void {
    // Implement real UI feedback if needed
    console.log('SUCCESS:', message);
  }
  error(message: string): void {
    // Implement real UI feedback if needed
    console.error('ERROR:', message);
  }
  actionWithUndo(message: string, undo: () => void): void {
    // Implement real UI feedback if needed
    console.log('ACTION:', message);
    // Optionally call undo()
  }
}
