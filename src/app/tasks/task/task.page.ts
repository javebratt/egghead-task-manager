import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
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
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { Task, TaskStatus } from '../tasks.models';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {
  team: string[] = ['Jorge Vergara', 'Andres Ebratt', 'John Doe', 'Jane Doe'];
  task$ = new BehaviorSubject<Task>({
    id: 'new',
    title: '',
    description: '',
    status: TaskStatus.TODO,
    createdAt: 0,
    attachments: [],
    assignee: null,
    user: '',
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly firestore: Firestore,
    private readonly storage: Storage,
    private readonly alertController: AlertController,
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly actionSheetCtrl: ActionSheetController,
    private readonly loadingController: LoadingController,
    private readonly auth: Auth
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params) => params['taskId'] as string),
        switchMap((taskId: string) =>
          docData(doc(this.firestore, `tasks/${taskId}`))
        ),
        map((task$) => task$ as Task)
      )
      .subscribe((task$) => {
        this.task$.next(task$);
      });
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
    const loading = await this.loadingController.create({});
    await loading.present();
    const file = $event.target.files[0];
    const storageRef = ref(
      this.storage,
      `${file.name}-${new Date().toISOString()}`
    );

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    loading.dismiss();
    const files = this.task$.value.attachments;
    files.push({
      url,
      name: file.name,
      size: file.size,
      type: file.type,
    });
    this.task$.next({ ...this.task$.value, attachments: files });
  }

  async assignTask() {
    const buttons = this.team.map((member) => ({
      text: member,
      data: member,
    }));

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Team',
      subHeader: 'Pick a team member',
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
    this.task$.next({ ...this.task$.value, assignee: result.data });
  }

  async saveTask() {
    const userId: string | null = this.auth.currentUser
      ? this.auth.currentUser.uid
      : null;
    if (!userId) {
      return;
    }

    const task = this.task$.value;

    task.user = userId;

    if (task.id === 'new') {
      const taskCollection = collection(this.firestore, `tasks`);
      const taskReference = await addDoc(taskCollection, { ...task });
      await updateDoc(taskReference, 'id', taskReference.id);
    } else {
      const taskReference = doc(this.firestore, `tasks/${task.id}`);
      await updateDoc(taskReference, { ...task });
    }

    this.presentToast();
    this.router.navigateByUrl('/tasks');
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
