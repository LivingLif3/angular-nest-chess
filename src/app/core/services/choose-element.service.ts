import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {FigureInfo} from "../types/figure-info";

@Injectable({
  providedIn: 'root'
})
export class ChooseElementService {

  choose$ = new BehaviorSubject<FigureInfo | null>(null)

  constructor() { }

}
