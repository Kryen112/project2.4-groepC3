import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from '../../communication.service';
import { AuthService } from '../../auth/auth.service';

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
    private router: Router,
    public commService: CommunicationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')
      this.getMail();
    })
  }

  getMail(): void {
    let user = this.authService.getUser();
    this.commService.getMail(user)
      .subscribe(
        (brieven) => {
          this.data = brieven;
          for (let brief of this.data) {
            if (brief['_id'] == this.id) {
              this.letter = brief['letter'];
              this.time = new Date(this.letter.send);
            }
          }
        });
  }

  deleteLetter(): void {
    this.commService.removeLetter(this.id)
      .subscribe(() => {});
    this.router.navigate(['secret/letterbox'])
  }
}
