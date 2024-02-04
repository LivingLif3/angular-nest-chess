import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChessCellComponent} from "../chess-cell/chess-cell.component";
import {Colors} from "../../../../core/types/cell-type";
import {FigureInfo} from "../../../../core/types/figure-info";
import {ChessBoardService} from "../../../../core/services/chess-board.service";

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

  constructor(private boardService: ChessBoardService) {
  }

  addId(id: number, element: Partial<FigureInfo>): Partial<FigureInfo> | null{
    return element ? {...element, id} : null
  }

  declareColor({i, j}: Record<string, number>) {
    return (i + j) % 2 === 0 ? Colors.BLACK : Colors.WHITE
  }

}
