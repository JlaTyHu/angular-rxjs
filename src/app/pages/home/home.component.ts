import { Component, OnInit } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../../components/courses-card-list/courses-card-list.component';
import { createHttpObservable } from '../../utils/create-http-observable';
import { catchError, delayWhen, finalize, map, Observable, of, retryWhen, shareReplay, throwError, timer } from 'rxjs';
import { ICourseModel } from '../../interfaces/course.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTabGroup, MatTab, CoursesCardListComponent, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  beginnerCourses$!: Observable<ICourseModel[]>;
  advancedCourses$!: Observable<ICourseModel[]>;

  ngOnInit(): void {
    const http$ = createHttpObservable('courses');

    const courses$: Observable<ICourseModel[]> = http$.pipe(
      // catchError((error) => {
      //   console.log('@@ error occurred', error);
      //
      //   return throwError(error);
      // }),
      // finalize(() => console.log('@@ finalize called')),
      map((response) => response.payload),
      shareReplay(),
      retryWhen((error) => error.pipe(
        delayWhen(() => timer(2000))
      ))
    );

    this.beginnerCourses$ = courses$.pipe(
      map((courses) => courses.filter(
        (course) => course.category === 'BEGINNER'
      ))
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses) => courses.filter(
        (course) => course.category === 'ADVANCED'
      ))
    );
  }
}
