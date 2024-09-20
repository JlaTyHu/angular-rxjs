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
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { ICourseModel } from '../../interfaces/course.model';
import { exhaustMap, filter, fromEvent, mergeMap, Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Component({
  selector: 'app-course-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatSelect,
    MatOption,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatDialogActions,
    MatButton,
    MatSuffix,
    MatLabel
  ],
  templateUrl: './course-dialog.component.html',
  styleUrl: './course-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseDialogComponent implements OnInit, AfterViewInit {
  readonly #formBuilder = inject(FormBuilder);
  readonly dialogData: ICourseModel = inject(MAT_DIALOG_DATA);

  @ViewChild('saveButton', {
    static: true,
    read: ElementRef
  })
  saveButton!: ElementRef;

  readonly courseForm = this.#formBuilder.group({
    description: [this.dialogData.description],
    category: [this.dialogData.category],
    releasedAt: [''],
    longDescription: [this.dialogData.longDescription]
  });

  ngAfterViewInit(): void {
    console.log('@@ sbtn ', this.saveButton.nativeElement);
    fromEvent(this.saveButton.nativeElement, 'click')
      .pipe(
        exhaustMap(() =>
          this.#saveCourse(this.courseForm.value as ICourseModel)
        )
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.courseForm.valueChanges
      .pipe(
        filter(() => this.courseForm.valid),
        mergeMap((changes) =>
          this.#saveCourse(changes as Partial<ICourseModel>)
        )
      )
      .subscribe();
  }

  onSave(): void {}

  onClose(): void {}

  #saveCourse(course: Partial<ICourseModel>): Observable<Response> {
    return fromPromise(
      fetch(`http://localhost:9000/api/courses/${this.dialogData.id}`, {
        method: 'PUT',
        body: JSON.stringify(course),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    );
  }
}
