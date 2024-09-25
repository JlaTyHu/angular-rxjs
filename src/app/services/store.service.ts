import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { ICourseModel } from '../interfaces/course.model';
import { createHttpObservable } from '../utils/create-http-observable';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  readonly #courses$$ = new BehaviorSubject<ICourseModel[]>([]);
  readonly courses$ = this.#courses$$.asObservable();

  initCourses(): void {
    const http$ = createHttpObservable('courses');

    http$.pipe(map((response) => response.payload)).subscribe({
      next: (courses) => this.#setCourses(courses)
    });
  }

  selectBeginnerCourses(): Observable<ICourseModel[]> {
    return this.#filterByCategory('BEGINNER');
  }

  selectAdvancedCourses(): Observable<ICourseModel[]> {
    return this.#filterByCategory('ADVANCED');
  }

  selectCourseById(courseId: number): Observable<ICourseModel> {
    return this.courses$.pipe(
      map((courses) => courses.find((course) => course.id === courseId)),
      filter((course) => !!course)
    );
  }

  saveCourse(
    courseId: number,
    changes: Partial<ICourseModel>
  ): Observable<any> {
    const courses = this.#courses$$.getValue();
    const courseIndex = courses.findIndex((course) => course.id === courseId);
    const newCourses = courses.slice(0);
    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes
    };

    this.#setCourses(newCourses);

    return fromPromise(
      fetch(`http://localhost:9000/api/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(changes),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    );
  }

  #filterByCategory(category: string): Observable<ICourseModel[]> {
    return this.courses$.pipe(
      map((courses) => courses.filter((course) => course.category === category))
    );
  }

  #setCourses(courses: ICourseModel[]): void {
    this.#courses$$.next(courses);
  }
}
