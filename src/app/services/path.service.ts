import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class PathService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) { }

  public getCurrentPath(): string {
    return this.document.location.href.split('#')[1];
  }
}
