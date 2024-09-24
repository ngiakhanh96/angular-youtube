import { InjectionToken } from '@angular/core';
import { BaseState } from '../models/state.model';
import { BaseSandboxService } from '../services/base.sandbox.service';

export const SandboxService = new InjectionToken<BaseSandboxService<BaseState>>(
  'SandboxService'
);