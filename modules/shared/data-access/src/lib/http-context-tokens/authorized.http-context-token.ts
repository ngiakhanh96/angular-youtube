import { HttpContextToken } from '@angular/common/http';

export const AUTHORIZED = new HttpContextToken<boolean>(() => true);
