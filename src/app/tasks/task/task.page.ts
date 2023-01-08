import { Component } from '@angular/core';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Task, TaskStatus } from '../tasks.models';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage {
  editTaskDescriptionStatus$ = new BehaviorSubject<boolean>(false);
  task$: Observable<Task> = this.route.params.pipe(
    map((params) => params['taskId'] as string),
    switchMap((taskId) =>
      taskId === 'new'
        ? of({
            id: 'new',
            title: 'New Task',
            description: 'You can add the description for your new task here.',
            status: TaskStatus.TODO,
            createdAt: 0,
            attachments: [],
          })
        : (docData(doc(this.firestore, `tasks/${taskId}`)) as Observable<Task>)
    )
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly firestore: Firestore
  ) {}

  editTaskDescription() {
    this.editTaskDescriptionStatus$.next(true);
  }

  deleteTask(taskId: string) {
    console.log('Delete task', taskId);
  }

  downloadAttachment(attachmentUrl: string) {
    console.log('Download attachment', attachmentUrl);
  }

  addAttachment() {
    console.log('Add attachment');
  }

  assignTask() {
    // Implement assign task
    // TODO: Open a list of the team members.
    // TODO: Get the value from that list of members and assign it to the task
    console.log('Assign task');
  }

  saveTask(task: Task) {
    console.log(task);
    if (task.id === 'new') {
      // TODO: Create a new task
    } else {
      // TODO: Update the task
    }
  }
}
