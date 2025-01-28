import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TimeEntryService } from '../time-entry.service';

@Injectable()
export class TimeEntryOwnerGuard implements CanActivate {
  constructor(private readonly timeEntryService: TimeEntryService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const timeEntryId = parseInt(request.params.id, 10);
    if (!timeEntryId) {
      throw new NotFoundException('timeEntryId');
    }
    const timeEntry = await this.timeEntryService.getTimeEntryById(timeEntryId);
    if (!timeEntry) {
      throw new NotFoundException();
    }
    if (timeEntry.user.id !== userId) {
      throw new ForbiddenException('You do not have access to this time entry');
    }
    return true;
  }
}
