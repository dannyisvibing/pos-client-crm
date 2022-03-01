import EventEmitter from 'tiny-emitter';
import moment from 'moment';
import _ from 'lodash';
import { getStartOfTimeUnit } from '../../utils/periodUtils';
import taskResource from './tasks.resource';
import TASKS from './task.constant';
import { BaseCard } from '../card/card.model';

export const TaskStatus = {
  PENDING: 'pending',
  COMPLETE: 'complete',
  CANCELLED: 'cancelled'
};

export const TASKS_EVENT = {
  TASKS_LOADED: 'tasks-loaded'
};

export class Task extends BaseCard {
  constructor(task, metadata) {
    super(task, metadata);
    console.log('constructor logging');
  }

  isNew() {
    return this._new;
  }

  setNew(isNew) {
    this._new = isNew;
  }
}

class TaskService extends EventEmitter {
  constructor() {
    super();
    this._tasks = [];
  }

  loadTasks(period, outlet) {
    this._loading = true;
    this._tasks = [];
    return this._loadTask(period, outlet)
      .then(data => {
        this.register(data.tasks);
        this._loading = false;
        this.emit(TASKS_EVENT.TASKS_LOADED);
      })
      .catch(() => {
        this._loading = false;
        this.emit(TASKS_EVENT.TASKS_LOADED);
      });
  }

  register(tasks) {
    this._tasks = [];
    _.forEach(tasks || [], taskData => {
      if (TASKS.hasOwnProperty(taskData.type)) {
        this._tasks.push(new Task(taskData, TASKS[taskData.type]));
      }
    });
  }

  refreshTasks(period, outlet) {
    return this._loadTask(period, outlet).then(data => {
      const existingTasks = this._tasks;
      this._tasks = [];
      _.forEach(data.tasks, taskData => {
        const taskIndex = _.findIndex(
          existingTasks,
          t => t.getData().id === taskData.id
        );
        let task;
        if (taskIndex > -1) {
          task = existingTasks.splice(taskIndex, 1)[0];
          task.updateData(taskData);
        } else if (TASKS.hasOwnProperty(taskData.type)) {
          task = new Task(taskData, TASKS[taskData.type]);
          task.setNew(true);
        }

        if (task) {
          this._tasks.push(task);
        }
      });
      this.emit(TASKS_EVENT.TASKS_LOADED);
    });
  }

  getTasks() {
    return this._tasks;
  }

  hasVisibleTasks() {
    return this._tasks.length > 0;
    // return _.some(this._tasks, task => task.isReady());
  }

  isLoading() {
    return this._loading || _.some(this._tasks, task => task.isLoading());
  }

  dismissTask(id) {
    this._tasks = _.filter(this._tasks, task => task.getData().id !== id);
  }

  _loadTask(period, outlet) {
    const dueAt = moment().endOf(getStartOfTimeUnit(period));
    return taskResource
      .getTasks(dueAt, outlet && outlet.outletId)
      .then(data => {
        this.isFailed = false;
        return data;
      })
      .catch(error => {
        this.isFailed = true;
      });
  }
}

export default TaskService;
