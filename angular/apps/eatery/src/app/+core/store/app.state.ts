import { ProtectedState } from '../../protected/+store/state';
import { CoreState } from './core.state';

export interface AppState {
  core: CoreState;
  protected?: ProtectedState;
}
