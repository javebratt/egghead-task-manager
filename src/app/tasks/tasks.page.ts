import { Component } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  collection,
  collectionData,
  Firestore,
  query,
  where,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Task } from './tasks.models';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage {
  tasks$ = authState(this.auth).pipe(
    switchMap((user) => {
      if (user) {
        return collectionData(
          query(
            collection(this.firestore, 'tasks'),
            where('user', '==', user.uid)
          )
        ) as Observable<Task[]>;
      } else {
        this.router.navigateByUrl('/auth/login');
        return EMPTY;
      }
    }),
    map((tasks: Task[]) =>
      tasks.sort((a, b) =>
        b.status > a.status ? 1 : a.status > b.status ? -1 : 0
      )
    )
  );

  constructor(
    private readonly firestore: Firestore,
    private readonly auth: Auth,
    private readonly router: Router
  ) {}
}
