import { Component } from '@angular/core';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Task, TaskStatus } from '../tasks.models';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage {
  newTask: Task = {
    id: '',
    title: 'New Ticket',
    description: '',
    status: TaskStatus.TODO,
    createdAt: 0,
    assignee: '',
    attachments: [],
  };

  task$: Observable<Task> = this.route.params.pipe(
    switchMap((params) => {
      const taskId: string = params['taskId'];
      return taskId === 'new'
        ? of(this.newTask)
        : (docData(doc(this.firestore, `tasks/${taskId}`)) as Observable<Task>);
    })
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly firestore: Firestore
  ) {}
}
