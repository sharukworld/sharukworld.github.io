import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
    selector: 'sw-jira-log',
    templateUrl: 'developer.log.component.html'
})

export class DeveloperLogComponent implements OnInit {
    constructor() { }
    @Input() user;
    @Input() jiraDomain;
    ticketUrl:string;
    ngOnChanges(change: SimpleChanges){
        console.log(change);
        this.ticketUrl = 'https://'+this.jiraDomain +'/browse/';
    }
  
    ngOnInit() { }
}