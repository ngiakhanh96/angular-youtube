import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// TODO bring this to store
@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  public currentState = true;
  private stateSubject = new BehaviorSubject<boolean>(this.currentState);

  state$ = this.stateSubject.asObservable();

  setState(state: boolean) {
    this.currentState = state;
    this.stateSubject.next(this.currentState);
  }

  toggle() {
    this.currentState = !this.currentState;
    this.stateSubject.next(this.currentState);
  }
}
