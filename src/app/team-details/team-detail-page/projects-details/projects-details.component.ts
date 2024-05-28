import { Component } from '@angular/core';
import { TeamDetailServiceService } from '../../team-detail-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CommunicationService } from 'src/app/common/communication.service';
import { BreadcrumbService } from 'src/app/bread-crumb/bread-crumb.service';

@Component({
  selector: 'app-projects-details',
  templateUrl: './projects-details.component.html',
  styleUrls: ['./projects-details.component.scss']
})
export class ProjectsDetailsComponent {
  projectColumns: any = []
  projectListInfo: any = [];
  listObservable: any;
  activeId: any = '';

  constructor(
    private communicationService: CommunicationService,
    private teamService: TeamDetailServiceService,
    private route: Router,
    private breadcrumbService: BreadcrumbService,
    private activeRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.activeId = this.activeRoute.snapshot.paramMap.get('teamId');
    this.communicationService.confirmActiveId(this.activeId);
    this.communicationService.confirmActiveSection('Projects');
    this.getProjects();
    this.projectColumns = [
      {
        "name": "profile",
        "label": "Profile",
        "widthPct": 10,
        "hidden": false
      },
      {
        "name": "voice",
        "label": "Voice",
        "widthPct": 10,
        "hidden": false
      },
      {
        "name": "developer",
        "label": "Developer",
        "widthPct": 10,
        "hidden": false
      },
      {
        "name": "state",
        "label": "Active",
        "widthPct": 10,
        "hidden": false
      },
      {
        "name": "joining",
        "label": "Joining Date",
        "widthPct": 10,
        "hidden": false 
      },
      {
        "name": "manager",
        "label": "Reporting Manager",
        "widthPct": 10,
        "hidden": false 
      }
    ];
    this.breadcrumbService.setBreadcrumbs([
      { active: 'Project Details'},
      { label: 'Home', url: '/' },
      { label: 'Team Details', url: '/tvm/team/teamlist' },
      { label: 'Project Details', url: this.route.url }
    ]);
  }
  getProjects() {
    this.teamService.getProjectDetailById(this.activeId).subscribe((result: any) => {
      this.projectListInfo = result.projects;
      this.projectListInfo.forEach((element: any) => {
        element.state = element.state == true ? 'Yes' : 'No';
        element.joining = new DatePipe('en-US').transform(element.joining, 'MM/dd/yyyy');
      });
      this.listObservable = new BehaviorSubject(this.projectListInfo);
    });
  }

  addNew(id: any) {
    let path = this.route.routerState.snapshot.url;
    this.route.navigateByUrl(path+'/'+id);
    this.communicationService.goBackClick(false);
  }

  rowClicked(id: any) {
    this.addNew(id);
  }

  saveImorteddetails(event: any) {
    this.teamService.addProject(this.activeId, event, 'importSave').subscribe((result: any) => {
      // this.route.navigateByUrl('/tvm/team/teamdetail/Employees/' + this.activeId);
    });
  }

  delete(id: any) {
    this.teamService.deleteProject(this.activeId, id).subscribe((res: any) => {
      this.getProjects();
    });
  }
}
