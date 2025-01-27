import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ProjectService } from '../project.service';

@Injectable()
export class ProjectOwnerGuard implements CanActivate {
  constructor(private readonly projectService: ProjectService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const projectId = parseInt(request.params.id, 10);
    if (!projectId) {
      throw new ForbiddenException('Invalid project ID');
    }
    const project = await this.projectService.getProjectById(projectId);
    if (project.user.id !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }
    return true;
  }
}
