import { Component, OnInit } from '@angular/core';
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
import { first, lastValueFrom } from 'rxjs';
import { Task, TaskStatus } from '../tasks.models';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {
  task!: Task;
  team: string[] = ['Jorge Vergara', 'Andres Ebratt', 'John Doe', 'Jane Doe'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly firestore: Firestore,
    private readonly storage: Storage,
    private readonly alertController: AlertController,
    private readonly router: Router,
    private readonly toastController: ToastController,
    private readonly actionSheetCtrl: ActionSheetController,
    private readonly loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.setCurrentTask();
  }

  async setCurrentTask() {
    const taskId: string = this.route.snapshot.params['taskId'];
    if (taskId === 'new') {
      this.task = {
        id: 'new',
        title: '',
        description: '',
        status: TaskStatus.TODO,
        createdAt: 0,
        attachments: [],
        assignee: null,
      };
    } else {
      this.task = (await lastValueFrom(
        docData(doc(this.firestore, `tasks/${taskId}`)).pipe(first())
      )) as Task;
    }
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

    this.task.attachments.push({
      url,
      name: file.name,
      size: file.size,
      type: file.type,
    });
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

    this.task.assignee = result.data;
  }

  async saveTask() {
    if (this.task.id === 'new') {
      const taskCollection = collection(this.firestore, `tasks`);
      const taskReference = await addDoc(taskCollection, { ...this.task });
      await updateDoc(taskReference, 'id', taskReference.id);
      // this.task.id = taskReference.id;
    } else {
      const taskReference = doc(this.firestore, `tasks/${this.task.id}`);
      await updateDoc(taskReference, { ...this.task });
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
