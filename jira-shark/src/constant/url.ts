export class  Url {

static get baseUrl(): string {
    return (window.location.hostname ==='localhost')?'http://localhost:8080':'https://jira-service-jira-service-backup.7e14.starter-us-west-2.openshiftapps.com';
}

static get worklog(): string {
    return '/worklogs';
}
}