import { Component } from '@angular/core';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Task } from '../tasks.models';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage {
  task$: Observable<Task> = this.route.params.pipe(
    map((params) => params['taskId'] as string),
    switchMap(
      (taskId) =>
        docData(doc(this.firestore, `tasks/${taskId}`)) as Observable<Task>
    )
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly firestore: Firestore
  ) {}
}
