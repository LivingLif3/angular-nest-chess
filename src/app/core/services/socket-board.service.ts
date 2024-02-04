import { Injectable } from '@angular/core';
import {io} from 'socket.io-client';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketBoardService {

  private socket = io('http://localhost:3000');

  constructor() { }

  connectRoom(id: string) {
    this.socket.emit('joinRoom', id)
  }

  getBoardInfo() {
    const observable = new Observable<{board: any}>(observer => {
      this.socket.on('move', (data) => {
        observer.next(data)
      });
      return () => { this.socket.disconnect() }
    })
    return observable
  }
 }
