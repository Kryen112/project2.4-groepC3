import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CommunicationService} from "../../communication.service";
import {AuthService} from "../../auth/auth.service";
import {JsonObject} from "@angular/compiler-cli/ngcc/src/packages/entry_point";

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {
  id:any;
  data: any[];
  letter: any;
  time: Date;

  constructor(
    private route: ActivatedRoute,
    public commService: CommunicationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')
      this.getMail();


    })
  }

  getMail() {
    let user = this.authService.getUser();
    console.log('username: ' + user);
    console.log(user);
    this.commService.getMail(user)
      .subscribe(
        (brieven) => {
          this.data = brieven;
          for (let brief of this.data) {
            if (brief['_id'] == this.id) {
              this.letter = brief['letter'];
              console.log(this.letter);
              this.time = new Date(this.letter.time);
              console.log(this.time);
            }
          }
        });

  }

}
