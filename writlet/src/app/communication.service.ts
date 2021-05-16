import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  letter = new BehaviorSubject(null);
  sharedLetter = this.letter.asObservable();

  constructor() { }

  nextLetter(letter){
    this.letter.next(letter);
  }

}


