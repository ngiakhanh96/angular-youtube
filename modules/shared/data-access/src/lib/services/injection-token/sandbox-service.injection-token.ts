import { InjectionToken } from '@angular/core';
import { BaseState } from '../../store/models/state.model';
import { BaseSandboxService } from '../base.sandbox.service';

export const SandboxService = new InjectionToken<BaseSandboxService<BaseState>>(
  'SandboxService'
);
