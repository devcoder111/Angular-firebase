import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import * as OpenSeadragon from 'openseadragon';

@Component({
  selector: 'fr-previewer',
  templateUrl: './images-previewer.component.html',
  styleUrls: ['./images-previewer.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagesPreviewerComponent implements OnChanges, OnDestroy {
  @Input() images: string[];
  previewer: OpenSeadragon;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['images'] &&
      JSON.stringify(changes.images.previousValue) !== JSON.stringify(changes.images.currentValue)
    ) {
      // TODO: use another way
      this.drawPreviewer(this.images);
    }
  }

  ngOnDestroy() {
    if (this.previewer) {
      this.previewer.destroy();
      this.previewer = null;
    }
  }

  private drawPreviewer(images: string[]) {
    if (this.previewer) {
      this.previewer.destroy();
    }
    if (images && images.length) {
      this.previewer = OpenSeadragon({
        tileSources: images.map(image => ({
          tileSource: { type: 'image', url: image },
        })),
        id: 'imagesPreviewContainer',
        prefixUrl: 'assets/openseadragon_images/',
        sequenceMode: true,
        collectionMode: true,
        showNavigator: true,
        showRotationControl: true,
        showSequenceControl: true,
        gestureSettingsTouch: {
          pinchRotate: true,
        },
        showReferenceStrip: true,
        autoHideControls: false,
      });
    }
  }
}
