import { Injectable } from '@angular/core';
import {
  ICommonState,
  selectCommonState,
} from '../store/common/reducers/common.reducer';
import { BaseSandboxService } from './base.sandbox.service';

@Injectable({
  providedIn: 'root',
})
export class CommonSandboxService extends BaseSandboxService<ICommonState> {
  constructor() {
    super(selectCommonState);
  }
}
