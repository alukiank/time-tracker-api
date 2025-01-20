import { Controller } from '@nestjs/common';
import { TimeEntryService } from './time-entry.service';

@Controller('time-entry')
export class TimeEntryController {
  constructor(private readonly timeEntryService: TimeEntryService) {}
}
