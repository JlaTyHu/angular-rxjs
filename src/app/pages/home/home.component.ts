import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../../components/courses-card-list/courses-card-list.component';
import { Observable } from 'rxjs';
import { ICourseModel } from '../../interfaces/course.model';
import { AsyncPipe } from '@angular/common';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTabGroup, MatTab, CoursesCardListComponent, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  readonly #storeService = inject(StoreService);

  beginnerCourses$!: Observable<ICourseModel[]>;
  advancedCourses$!: Observable<ICourseModel[]>;

  ngOnInit(): void {
    this.beginnerCourses$ = this.#storeService.selectBeginnerCourses();
    this.advancedCourses$ = this.#storeService.selectAdvancedCourses();
  }
}
