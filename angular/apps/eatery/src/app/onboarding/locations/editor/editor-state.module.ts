import { LocationsEditorCreateActionEffect } from './+actions/create.action';
import { LocationsEditorLoadActionEffect } from './+actions/load.action';
import { LocationsEditorLoadLocationFailedActionEffect } from './+actions/loadFailed.action';
import { LocationsEditorSaveActionEffect } from './+actions/save.action';
import { LocationsEditorSaveFailedActionEffect } from './+actions/saveFailed.action';
import { LocationsEditorSaveSuccessfulActionEffect } from './+actions/saveSuccessful.action';

export class LocationsEditorStateModule {
  static effects = [
    LocationsEditorCreateActionEffect,
    LocationsEditorLoadActionEffect,
    LocationsEditorLoadLocationFailedActionEffect,
    LocationsEditorSaveActionEffect,
    LocationsEditorSaveSuccessfulActionEffect,
    LocationsEditorSaveFailedActionEffect,
  ];
}
