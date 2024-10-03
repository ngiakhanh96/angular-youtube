import { InjectionToken } from '@angular/core';
import { IBaseState } from '../models/state.model';
import { BaseSandboxService } from '../services/base.sandbox.service';

export const SandboxService = new InjectionToken<
  BaseSandboxService<IBaseState>
>('SandboxService');
