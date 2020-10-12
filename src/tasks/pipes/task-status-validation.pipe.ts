import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    TaskStatus.OPEN,
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS
  ];

  private isStatusValid(status: any) {
    const idx = this.allowedStatus.indexOf(status);
    return idx !== -1;
  }

  transform(value: any): any {
    value.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`)
    }
    return value;
  }
}
