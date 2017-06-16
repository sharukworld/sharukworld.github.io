export class  Url {

static get user():string {
return '/rest/api/2/user/assignable/search?project=';
}
static get allTicketWorkLog(){
    return '/rest/api/2/search?maxResults=2000'
}
static get givenIssue(){
    return '/rest/api/2/issue/';
}
}