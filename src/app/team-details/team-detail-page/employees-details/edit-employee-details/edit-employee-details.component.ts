import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from 'src/app/common/communication.service';
import { FormGeneratorComponent } from 'src/app/common/form-generator/form-generator.component';
import { TeamDetailServiceService } from 'src/app/team-details/team-detail-service.service';
@Component({
  selector: 'app-edit-employee-details',
  templateUrl: './edit-employee-details.component.html',
  styleUrl: './edit-employee-details.component.scss'
})
export class EditEmployeeDetailsComponent implements OnInit {
  Pageheader = 'Edit Employee Details';
  projectDetails: any;
  formObject = {
    General: [
      {
        "name": "Employee",
        "label": "Employee Name",
        type: "String"
      },
      {
        "name": "Experienceyear",
        "label": "Year of Experience",
        type: "String"
      },
      {
        "name": "Specifications",
        "label": "Specifications",
        type: "String"
      },
      {
        "name": "Qualifications",
        "label": "Qualifications",
        type: "String"
      },
      {
        "name": "Emergency contacts",
        "label": "Emergency contacts",
        type: "number"
      },
      {
        "name": "Job information",
        "label": "Job information",
        type: "String"
      },
      {
        "name": "Contact number",
        "label": "Contact number",
        type: "number"
      },
      {
        "name": "Email address",
        "label": "Email address",
        type: "email"
      },
      {
        "name": "joining",
        "label": "Date of Joining",
        type: "Date",
        readonly: false
      },
      {
        "name": "Home address",
        "label": "Home address",
        type: "String"
      },
    ]
  };
  activeId: any = 0;
  teamId: any = 0;

  @ViewChild(FormGeneratorComponent, { static: true }) formGenerationComponent!: FormGeneratorComponent;

  constructor(
    private communicationService: CommunicationService,
    private teamService: TeamDetailServiceService,
    private activeRoute: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.activeId = this.activeRoute.snapshot.paramMap.get('empId');
    this.teamId = this.activeRoute.snapshot.paramMap.get('teamId');
    this.communicationService.confirmActiveSection('Employees');

    this.getEmployeeDetail();
  }

  getEmployeeDetail() {
    this.teamService.getEmployeeById(this.teamId, this.activeId).subscribe((result: any) => {
      let res = result[0];
      for (const section in res) {
        this.formObject.General.map((element: any) => {
          let ele = res[section];
          if (element.name == section) {
            if (element.type == 'Date') {
              let datePipe: DatePipe = new DatePipe('en-US');
              ele = datePipe.transform(ele, 'MM/dd/yyyy');
            }
            element.value = ele;
          }
        });
      }
      this.projectDetails = this.formObject;
    });
  }

  formGenerated(event: any) {
    // this.formGenerationComponent.appForm.controls['state'].valueChanges.subscribe((res: any) => {
    //   if (res == true) {
    //     this.formGenerationComponent.appForm.controls['relieving'];
    //   }
    // });
  }

  save(formValue: any) {
    this.teamService.addEmployee(this.teamId, formValue).subscribe((result: any) => {
      result.subscribe((res: any) => {
        this.route.navigateByUrl('/tvm/team/teamdetail/Employees/' + this.teamId);
      });
    });
  }

}
