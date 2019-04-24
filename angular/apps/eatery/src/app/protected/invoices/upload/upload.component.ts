import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { getStoragePathToInvoiceImage, getStoragePathToInvoicePDF } from '@shared/values/storagePaths.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, finalize, first } from 'rxjs/operators';
import { AppState } from '../../../+core/store/app.state';
import { getActiveLocationId, getActiveOrganizationId, getUser } from '../../../+core/store/selectors';
import { LoggerService } from '../../../+shared/services/logger.service';
import { trackByFn } from '../../../../../../../shared/trackBy.helper';

enum TaskStatus {
  inProgress = 'inProgress',
  completed = 'completed',
  error = 'error',
}

@Component({
  selector: 'fr-invoices-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesUploadComponent implements OnInit, OnDestroy {
  tasks: {
    task: AngularFireUploadTask;
    progress$: Observable<number>;
    status: TaskStatus;
    previewDataURL: string;
    error?: Error;
    fileSize?: number;
  }[] = [];
  fileDraggedCSSClass = 'on-file-dragged';
  fileDraggedDropzoneElementCSSSelector = '.dropzone';
  fileDraggedHandlerItems: {
    element: Element;
    eventName: string;
    handler: EventListener;
  }[] = [];
  wasBottomInfoPanelClosed: false;

  trackByFn = trackByFn;

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private cd: ChangeDetectorRef,
    private store: Store<AppState>,
    private logger: LoggerService,
  ) {}

  ngOnInit() {
    const dropzoneElement = document.querySelector(this.fileDraggedDropzoneElementCSSSelector);
    const addClassToBody = () => document.body.classList.add(this.fileDraggedCSSClass);
    const removeClassFromBody = () => document.body.classList.remove(this.fileDraggedCSSClass);
    this.fileDraggedHandlerItems = [
      {
        element: document.body,
        eventName: 'dragenter',
        handler: addClassToBody,
      },
      {
        element: dropzoneElement,
        eventName: 'dragleave',
        handler: removeClassFromBody,
      },
      {
        element: dropzoneElement,
        eventName: 'drop',
        handler: removeClassFromBody,
      },
    ];
    for (const item of this.fileDraggedHandlerItems) {
      item.element.addEventListener(item.eventName, item.handler);
    }
  }

  ngOnDestroy() {
    for (const item of this.fileDraggedHandlerItems) {
      item.element.removeEventListener(item.eventName, item.handler);
    }
  }

  uploadFile(event) {
    const files = event.target.files;
    if (!files.length) {
      return;
    }
    this.store.pipe(first()).subscribe(state => {
      for (const f of files) {
        if (
          !['application/pdf', 'image/vnd.sealedmedia.softseal-jpg', 'image/jpeg', 'image/pjpeg', 'image/png'].includes(
            f.type,
          )
        ) {
          continue;
        }
        const isPDF = f.type === 'application/pdf';
        const filePath = isPDF
          ? getStoragePathToInvoicePDF({
              organizationId: getActiveOrganizationId(state),
              locationId: getActiveLocationId(state),
              userId: getUser(state).id,
              invoiceId: null,
              fileId: this.db.createId(),
            })
          : getStoragePathToInvoiceImage({
              organizationId: getActiveOrganizationId(state),
              locationId: getActiveLocationId(state),
              userId: getUser(state).id,
              invoiceId: this.db.createId(),
              fileId: this.db.createId(),
            });
        let taskItem = {
          task: null,
          progress$: null,
          status: TaskStatus.inProgress,
          error: null,
          previewDataURL: null,
          id: null,
          fileSize: parseFloat((f.size / (1024 * 1024)).toFixed(2)),
        };
        const taskIndex = this.tasks.length;
        this.tasks = [...this.tasks, taskItem];
        taskItem = { ...taskItem, id: this.tasks.length - 1 };
        const fileSizeLimit = isPDF ? 100 : 10;
        if (taskItem.fileSize && taskItem.fileSize > fileSizeLimit) {
          taskItem.error = new Error(`File is bigger than ${fileSizeLimit}MB`);
          taskItem.status = TaskStatus.error;
          this.tasks[taskItem.id] = { ...this.tasks[taskItem.id], status: taskItem.status, error: taskItem.error };
        } else {
          const task = this.storage.upload(filePath, f);
          this.tasks[taskItem.id] = {
            ...this.tasks[taskItem.id],
            task: task,
            progress$: task.percentageChanges(),
          };
          const reader = new FileReader();
          reader.onload = e => {
            taskItem.previewDataURL = isPDF ? 'assets/pdf-preview.png' : (e.target as any).result;
            this.tasks[taskItem.id] = {
              ...this.tasks[taskItem.id],
              previewDataURL: taskItem.previewDataURL,
            };
            this.cd.detectChanges();
          };
          reader.readAsDataURL(f);
          task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                this.tasks = this.tasks.map(
                  (item, index) => (index === taskIndex ? ({ ...item, status: TaskStatus.completed } as any) : item),
                );
                this.cd.detectChanges();
              }),
              catchError(error => {
                this.tasks = this.tasks.map(
                  (item, index) => (index === taskIndex ? ({ ...item, status: TaskStatus.error, error } as any) : item),
                );
                taskItem.error = error;
                this.cd.detectChanges();
                this.logger.error('InvoicesUploadComponent.uploadFile - Attachment upload was failed', error);
                return of(null);
              }),
            )
            .subscribe();
        }
        this.cd.detectChanges();
      }
    });
  }
}
