import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardTitle
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ICourseModel } from '../../interfaces/course.model';
import { MatDialog } from '@angular/material/dialog';
import { CourseDialogComponent } from '../../dialogs/course-dialog/course-dialog.component';

@Component({
  selector: 'app-courses-card-list',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatCardImage,
    MatButton,
    RouterLink,
    MatCardTitle
  ],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesCardListComponent {
  readonly #dialog = inject(MatDialog);

  @Input({ required: true }) courses: ICourseModel[] | null = [];

  onEditCourse(course: ICourseModel) {
    this.#dialog.open(CourseDialogComponent, {
      data: { ...course }
    });
  }
}
