import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TasksPageRoutingModule } from './tasks-routing.module';

import { FileSizePipeModule } from '../shared/pipes/file-size.pipe.module';
import { TaskPage } from './task/task.page';
import { TasksPage } from './tasks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TasksPageRoutingModule,
    FileSizePipeModule,
  ],
  declarations: [TasksPage, TaskPage],
})
export class TasksPageModule {}
