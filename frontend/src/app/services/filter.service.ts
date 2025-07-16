import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private filterClickedSource = new Subject<void>();
  filterClicked$ = this.filterClickedSource.asObservable();

  triggerFilter() {
    this.filterClickedSource.next();
  }
}
