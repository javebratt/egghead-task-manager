import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskPage } from './task/task.page';

import { TasksPage } from './tasks.page';

const routes: Routes = [
  {
    path: '',
    component: TasksPage,
  },
  {
    path: 'task/:taskId',
    component: TaskPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksPageRoutingModule {}
