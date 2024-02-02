import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChessCellComponent} from "../chess-cell/chess-cell.component";
import {Colors} from "../../types/cell-type";
import {CreateFigureService} from "../../services/create-figure.service";
import {FiguresType} from "../../types/figures-type";
import {FigureInfo} from "../../types/figure-info";
import {ChessBoardService} from "../../services/chess-board.service";

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule, ChessCellComponent],
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChessBoardComponent {

  boardFigures = this.boardService.board

  colors: any = {
    white: Colors.WHITE,
    black: Colors.BLACK
  }

  constructor(private boardService: ChessBoardService) {
  }

  addId(id: number, element: Partial<FigureInfo>): Partial<FigureInfo> | null{
    return element ? {...element, id} : null
  }

}
