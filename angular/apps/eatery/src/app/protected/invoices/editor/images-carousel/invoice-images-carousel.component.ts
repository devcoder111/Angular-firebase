import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getStoragePathToInvoiceImage } from '@shared/values/storagePaths.map';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, finalize, first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../../../+core/store/app.state';
import { getActiveLocationId, getActiveOrganizationId, getUser } from '../../../../+core/store/selectors';
import { LoggerService } from '../../../../+shared/services/logger.service';
import { trackByFn } from '../../../../../../../../shared/trackBy.helper';
import {
  getInvoicesEditorCarouselHasNext,
  getInvoicesEditorCarouselHasPrev,
  getInvoicesEditorImagesLoading,
  getInvoicesEditorInvoice,
  getInvoicesEditorInvoiceCarouselImages,
  getInvoicesEditorInvoiceImages,
  getInvoicesEditorInvoiceImagesArray,
} from '../editor.selectors';
import { CarouselGetPrevPageAction } from '../+actions/carouselGetPrevPage.action';
import { CarouselGetNextPageAction } from '../+actions/carouselGetNextPage.action';
import { CarouselApplyOrderAction } from '../+actions/carouselApplyOrder.action';
import { DeleteImageAction } from '../+actions/deleteImage.action';
import { File } from '@shared/types/file.interface';
import { CarouselSetImageLoading } from '../+actions/carouselSetImageLoading.action';
import { SortablejsOptions } from 'angular-sortablejs';

@Component({
  selector: 'fr-invoice-images-carousel',
  templateUrl: 'invoice-images-carousel.component.html',
  styleUrls: ['./invoice-images-carousel.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceImagesCarouselComponent implements OnDestroy {
  sub = new Subscription();

  @Input()
  isReadOnly: boolean;

  images$ = this.store.pipe(select(getInvoicesEditorInvoiceImages));
  imagesArray$ = this.store.pipe(select(getInvoicesEditorInvoiceImagesArray));
  visibleImages$ = this.store.pipe(select(getInvoicesEditorInvoiceCarouselImages));
  carouselHasNext$ = this.store.pipe(select(getInvoicesEditorCarouselHasNext));
  carouselHasPrev$ = this.store.pipe(select(getInvoicesEditorCarouselHasPrev));
  isLoadingImages$ = this.store.pipe(select(getInvoicesEditorImagesLoading));

  selectedImage: string[];
  tasks: {
    task: AngularFireUploadTask;
    progress$: Observable<number>;
    isCompleted: boolean;
    error?: Error;
    fileSize?: number;
  }[] = [];
  carouselOptions: SortablejsOptions;

  trackByFn = trackByFn;

  constructor(
    private store: Store<AppState>,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private cd: ChangeDetectorRef,
    private logger: LoggerService,
  ) {
    this.carouselOptions = {
      onUpdate: (event: any) => {
        this.carouselReorder();
      },
    };
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  uploadFile(uploadFileEvent) {
    const files = uploadFileEvent.target.files;
    if (!files.length) {
      return;
    }
    this.store.pipe(first()).subscribe(state => {
      for (const file of files) {
        if (!['image/vnd.sealedmedia.softseal-jpg', 'image/jpeg', 'image/pjpeg', 'image/png'].includes(file.type)) {
          continue;
        }
        const filePath = getStoragePathToInvoiceImage({
          organizationId: getActiveOrganizationId(state),
          locationId: getActiveLocationId(state),
          userId: getUser(state).id,
          invoiceId: getInvoicesEditorInvoice(state).id,
          fileId: this.db.createId(),
        });
        let taskItem = {
          task: null,
          progress$: null,
          isCompleted: false,
          error: null,
          previewDataURL: null,
          fileSize: parseFloat((file.size / (1024 * 1024)).toFixed(2)),
        };
        this.tasks.push(taskItem);
        if (taskItem.fileSize && taskItem.fileSize > 10) {
          taskItem.error = new Error('Image is bigger than 10MB');
        } else {
          const task = this.storage.upload(filePath, file);
          taskItem = {
            ...taskItem,
            task,
            progress$: task.percentageChanges(),
          };
          const reader = new FileReader();
          reader.onload = onloadEvent => {
            taskItem.previewDataURL = (onloadEvent.target as any).result;
            this.selectedImage = [taskItem.previewDataURL];
            this.cd.detectChanges();
          };
          reader.readAsDataURL(file);
          task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                taskItem.isCompleted = true;
                this.store.dispatch(new CarouselSetImageLoading());
                this.selectedImage = [taskItem.previewDataURL];
                this.cd.detectChanges();
              }),
              catchError(error => {
                taskItem.error = new Error('Upload failed. Try again later or contact support.');
                this.cd.detectChanges();
                this.logger.error(`InvoiceImagesCarouselComponent.uploadFile - Attachment upload was failed`, error);
                return of(null);
              }),
            )
            .subscribe();
        }
      }
    });
    this.cd.detectChanges();
  }

  showImage(image: string) {
    this.selectedImage = [image];
  }

  carouselGetNextPage() {
    this.store.dispatch(new CarouselGetNextPageAction());
  }

  carouselGetPrevPage() {
    this.store.dispatch(new CarouselGetPrevPageAction());
  }

  carouselReorder() {
    this.store.dispatch(new CarouselApplyOrderAction());
  }

  deleteImage(image: File) {
    this.store.dispatch(new DeleteImageAction(image));
  }
}
