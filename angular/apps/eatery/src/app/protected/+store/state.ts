import { InvoiceAdjustmentType } from '@shared/types/invoiceAdjustmentType.interface';
import { ProductCategory } from '@shared/types/productCategory.interface';
import { UnitType } from '@shared/types/unitType.interface';
import { Observable } from 'rxjs/Observable';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface ProtectedState {
  ui: {
    isMenuOpened: boolean;
    deviceType: DeviceType;
  };
  profile: {
    isAvatarUploadInProgress: boolean;
    uploadProgress$: Observable<number>;
  };
  productCategories: {
    ids: string[];
    items: { [id: string]: ProductCategory };
    loadError: Error;
    isLoading: boolean;
  };
  unitTypes: {
    ids: string[];
    items: { [id: string]: UnitType };
    loadError: Error;
    isLoading: boolean;
  };
  invoiceAdjustmentTypes: {
    ids: string[];
    items: { [id: string]: InvoiceAdjustmentType };
    loadError: Error;
    isLoading: boolean;
  };
}

export const ProtectedStateInitial: ProtectedState = {
  ui: {
    isMenuOpened: false,
    deviceType: 'mobile',
  },
  profile: {
    isAvatarUploadInProgress: false,
    uploadProgress$: null,
  },
  unitTypes: {
    ids: [],
    items: {},
    loadError: null,
    isLoading: false,
  },
  productCategories: {
    ids: [],
    items: {},
    loadError: null,
    isLoading: false,
  },
  invoiceAdjustmentTypes: {
    ids: [],
    items: {},
    loadError: null,
    isLoading: false,
  },
};
