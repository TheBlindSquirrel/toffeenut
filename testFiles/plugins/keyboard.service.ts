import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { formatISO } from 'date-fns';
import { EMPTY, from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Keyboard } from '@capacitor/keyboard';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  constructor() {}


}
