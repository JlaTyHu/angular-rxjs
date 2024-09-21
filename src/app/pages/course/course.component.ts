import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  concat,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  switchMap
} from 'rxjs';
import { ICourseModel } from '../../interfaces/course.model';
import { ILessonModel } from '../../interfaces/lesson.model';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { createHttpObservable } from '../../utils/create-http-observable';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    AsyncPipe,
    MatFormField,
    MatInput,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatLabel
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit, AfterViewInit {
  readonly #route = inject(ActivatedRoute);

  course$!: Observable<ICourseModel>;
  lessons$!: Observable<ILessonModel[]>;

  readonly displayedColumns = ['seqNo', 'description', 'duration'];
  courseId!: string;

  @ViewChild('searchInput') input!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.courseId = this.#route.snapshot.params['id'];

    this.course$ = createHttpObservable(`courses/${this.courseId}`);
  }

  ngAfterViewInit(): void {
    const searchLessons$ = fromEvent(this.input.nativeElement, 'keyup').pipe(
      map((event) => event.target as HTMLInputElement),
      map((element) => element.value),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((search) => this.loadLessons(search))
    );

    const initialLessons$ = this.loadLessons();

    this.lessons$ = concat(initialLessons$, searchLessons$);
  }

  protected loadLessons(search = ''): Observable<ILessonModel[]> {
    return createHttpObservable(
      `lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map((response) => response.payload));
  }
}
