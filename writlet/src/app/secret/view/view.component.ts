import { Component, OnInit } from '@angular/core';
import { CommunicationService } from 'src/app/communication.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  letter;

  constructor(private commService: CommunicationService) { }

  ngOnInit(): void {
    this.commService.letter.subscribe(letter => this.letter = letter);
  }

}
