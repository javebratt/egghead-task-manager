import { Component } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from './tasks.models';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage {
  tasks$ = (
    collectionData(collection(this.firestore, 'tasks')) as Observable<Task[]>
  ).pipe(
    map((tasks) =>
      tasks.sort((a, b) =>
        b.status > a.status ? 1 : a.status > b.status ? -1 : 0
      )
    )
  );

  constructor(private readonly firestore: Firestore) {}
}
