import { Observable, Observer } from 'rxjs';

export function createHttpObservable(url: string): Observable<any> {
  return new Observable((observer: Observer<any>) => {
    fetch(url)
      .then((response) => response.json())
      .then((body) => {
        observer.next(body);
        observer.complete();
      })
      .catch((error) => observer.error(error));
  });
}
