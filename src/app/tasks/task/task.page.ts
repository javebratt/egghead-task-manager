import { Component } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  docData,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject, lastValueFrom, Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Task, TaskStatus } from '../tasks.models';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage {
  editTaskDescriptionStatus$ = new BehaviorSubject<boolean>(true);
  editTaskTitleStatus$ = new BehaviorSubject<boolean>(true);
  task$: Observable<Task> = this.route.params.pipe(
    map((params) => params['taskId'] as string),
    switchMap((taskId) =>
      taskId === 'new'
        ? of({
            id: 'new',
            title: '',
            description: '',
            status: TaskStatus.TODO,
            createdAt: 0,
            attachments: [],
            assignee: null,
          })
        : (docData(doc(this.firestore, `tasks/${taskId}`)) as Observable<Task>)
    )
  );

  team: string[] = ['Jorge Vergara', 'Andres Ebratt', 'John Doe', 'Jane Doe'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly firestore: Firestore,
    private readonly storage: Storage,
    private readonly alertController: AlertController,
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly actionSheetCtrl: ActionSheetController
  ) {}

  editTaskDescription() {
    this.editTaskDescriptionStatus$.next(false);
  }

  editTaskTitle() {
    this.editTaskTitleStatus$.next(false);
  }

  async deleteTask(name: string, taskId: string) {
    const alert = await this.alertController.create({
      header: name,
      message: 'Are you sure you want to delete this task?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            deleteDoc(doc(this.firestore, `tasks/${taskId}`));
            this.router.navigateByUrl('/tasks');
          },
        },
      ],
    });
    await alert.present();
  }

  downloadAttachment(name: string, url: string) {
    const link = document.createElement('a');
    link.download = name;
    link.href = url;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  addAttachment(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  async uploadFile($event: any) {
    const file = $event.target.files[0];

    const task = await lastValueFrom(this.task$.pipe(first()));

    const storageRef = ref(this.storage, `${task.id}/${file.name}`);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    task.attachments.push({
      url,
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const taskReference = doc(this.firestore, `tasks/${task.id}`);

    await updateDoc(taskReference, { ...task });

    return this.presentToast('File Uploaded Successfully');
  }

  async assignTask() {
    const buttons = this.team.map((member) => ({
      text: member,
      data: member,
    }));

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Example header',
      subHeader: 'Example subheader',
      buttons: [
        ...buttons,
        {
          text: 'Cancel',
          role: 'cancel',
          data: null,
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();

    if (!result.data) {
      return;
    }

    const task = await lastValueFrom(this.task$.pipe(first()));
    task.assignee = result.data;
    const taskReference = doc(this.firestore, `tasks/${task.id}`);

    await updateDoc(taskReference, { ...task });

    return this.presentToast();
  }

  async saveTask(task: Task) {
    if (task.id === 'new') {
      const taskCollection = collection(this.firestore, `tasks`);
      const taskReference = await addDoc(taskCollection, { ...task });
      await updateDoc(taskReference, 'id', taskReference.id);
      this.presentToast();
      this.router.navigateByUrl('/tasks');
    } else {
      const taskReference = doc(this.firestore, `tasks/${task.id}`);
      await updateDoc(taskReference, { ...task });
      return this.presentToast();
    }
  }

  async presentToast(message: string = 'Task Successfully Updated') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
      color: 'success',
    });

    await toast.present();
  }
}
