import { first } from 'rxjs/operators';
import { User } from '@shared/types/user.interface';
import { getUser } from '../apps/eatery/src/app/+core/store/selectors';
import { select } from '@ngrx/store';

export function getCurrentUser(store): User {
  return store
    .pipe(
      select(getUser),
      first(),
    )
    .toPromise();
}
