import { Observable, Observer } from 'rxjs';

export function createHttpObservable(url: string): Observable<any> {
  return new Observable((observer: Observer<any>) => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`http://localhost:9000/api/${url}`, { signal })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          observer.error('Request failed with status code: ' + response.status);
          return null;
        }
      })
      .then((body) => {
        observer.next(body);
        observer.complete();
      })
      .catch((error) => observer.error(error));

    return () => controller.abort();
  });
}
