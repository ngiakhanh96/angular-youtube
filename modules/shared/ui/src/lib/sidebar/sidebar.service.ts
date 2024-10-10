import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// TODO bring this to store
@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private currentState = false;
  private stateSubject = new BehaviorSubject<boolean>(this.currentState);

  state$ = this.stateSubject.asObservable();

  open() {
    this.currentState = true;
    this.stateSubject.next(this.currentState);
  }

  collapse() {
    this.currentState = false;
    this.stateSubject.next(this.currentState);
  }

  toggle() {
    this.currentState = !this.currentState;
    this.stateSubject.next(this.currentState);
  }
}
