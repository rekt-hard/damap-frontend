import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {Contributor} from "../../model/contributor";
import {Dmp} from "../../model/dmp";
import {Observable, Subject} from "rxjs";
import {Project} from "../../model/project";

@Component({
  selector: 'app-dmp-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  @Input() dmp: Dmp;
  @Input() people: Contributor[]; // list of people from backend
  peopleList: Contributor[] = []; // people minus selected contributors

  @Output() contactPerson = new EventEmitter<Contributor>();
  @Output() removeContactPerson = new EventEmitter<Contributor>();
  @Output() contributorToAdd = new EventEmitter<Contributor>();
  @Output() contributorToRemove = new EventEmitter<Contributor>();
  @Output() contributorToUpdate = new EventEmitter<Contributor>();

  // todo: search
  contributors$: Observable<Project[]>;
  private searchTerms = new Subject<string>();

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.getPeople();
    // TODO
    /*if(this.dmp.contact == null && this.dmp.projects != null) {
      this.setContactPerson(this.dmp.projects[0].leader);
    }*/
  }

  setContactPerson(contact: Contributor) {
    this.contactPerson.emit(contact);
  }

  unsetContactPerson() {
    this.removeContactPerson.emit();
  }

  addContributor(contributor: Contributor) {
    this.contributorToAdd.emit(contributor);
    this.filterPeople();
  }

  removeContributor(contributor: Contributor) {
    this.contributorToRemove.emit(contributor);
    this.filterPeople();
  }

  updateContributorRoles(contributor: Contributor, role: string) {

  }

  private getPeople(): void {
    this.backendService.getPersons()
      .subscribe(people => {
        this.people = people;
      });
    this.filterPeople();
  }

  // fixme
  private filterPeople(): void {
    this.peopleList = Object.assign([], this.people);
    if (this.dmp.contributors) {
      for (let entry of this.dmp.contributors) {
        this.peopleList = this.peopleList.filter(e => e !== entry);
      }
    }
  }
}
