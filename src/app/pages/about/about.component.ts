import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { concat, interval, map, merge, of } from 'rxjs';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
  ngOnInit() {
    // const source1$ = of(1, 2, 3);
    // const source2$ = of(4, 5, 6);
    // const source3$ = of(7, 8, 9);
    //
    // const result$ = concat(
    //   source1$,
    //   source2$,
    //   source3$
    // );
    //
    // result$.subscribe({
    //   next: (val) => console.log('@@ result$ val: ', val)
    // });

    const interval1$ = interval(1000);
    const interval2$ = interval1$.pipe(map((val) => val * 10));
    const result$ = merge(interval1$, interval2$);
    result$.subscribe(console.log)
  }
}
