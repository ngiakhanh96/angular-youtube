import { HttpContextToken } from '@angular/common/http';

export const SKIP_RETRY = new HttpContextToken<boolean>(() => false);
