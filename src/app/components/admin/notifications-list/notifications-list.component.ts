import { Component } from '@angular/core';
import { NotificationCardComponent } from '../notification-card/notification-card.component';
import { ChargePeriodService } from '../../../services/charge-period/charge-period.service';
import { CustomHttpErrorResponse } from '../../../interfaces/responses/error';
import { convertDateFormat } from '../../../utils/date';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [NotificationCardComponent],
  templateUrl: './notifications-list.component.html',
  styleUrl: './notifications-list.component.scss',
})
export class NotificationsListComponent {
  period: string = '';

  constructor(private readonly chargePeriodService: ChargePeriodService) {
    this.chargePeriodService.getChargePeriod().subscribe({
      next: (response) => {
        const startDateString = convertDateFormat(
          response.data.startTimestamp.slice(0, 10)
        );
        const endDateString = convertDateFormat(
          response.data.endTimestamp.slice(0, 10)
        );
        const startDate = new Date(response.data.startTimestamp);
        const endDate = new Date(response.data.endTimestamp);
        const today = new Date();
        if (today >= startDate && today <= endDate) {
          this.period = `${startDateString} - ${endDateString}`;
        }
      },
      error: (error: CustomHttpErrorResponse) => {},
    });
  }
}
