import { Observable, tap } from 'rxjs';
import { RxJsLoggingLevel } from '../enums/rxjs-logging-level';

export const debug =
  (level: RxJsLoggingLevel) => (source: Observable<any>) =>
    source.pipe(
      tap((value) => {
        if (level >= RxJsLoggingLevel.Info) {
          console.log('@@ message: ', value);
        }
      })
    );
