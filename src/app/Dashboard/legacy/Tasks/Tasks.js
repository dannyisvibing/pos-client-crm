import React, { Component } from 'react';
import { TASKS_EVENT } from '../../managers/task/task.service';
import rbDashboardService from '../../managers/dashboard/dashboard.service';
import Task from './Task';
import { RBLoader } from '../../../../rombostrap';

class Tasks extends Component {
  state = {};

  componentWillMount() {
    this.init();
    this._onTasksLoaded = () => this.init();
    rbDashboardService.taskService.on(
      TASKS_EVENT.TASKS_LOADED,
      this._onTasksLoaded
    );
  }

  componentWillUnmount() {
    rbDashboardService.taskService.off(
      TASKS_EVENT.TASKS_LOADED,
      this._onTasksLoaded
    );
  }

  init() {
    const taskService = rbDashboardService.taskService;
    this.setState({
      hasVisibleTasks: taskService.hasVisibleTasks(),
      isLoading: taskService.isLoading(),
      isFailed: taskService.isFailed
    });
  }

  render() {
    const taskService = rbDashboardService.taskService;
    const { hasVisibleTasks, isLoading, isFailed } = this.state;
    return (
      <div>
        {!hasVisibleTasks && (
          <div className="vd-align-center">
            <hr className="vd-hr ds-hr" />
            {!isLoading &&
              !isFailed && (
                <div className="vd-mal vd-align-left">
                  There's nothing to do in your list
                </div>
              )}
            {isLoading && <RBLoader />}
          </div>
        )}
        {hasVisibleTasks && (
          <div className="vd-g-row vd-g-row--gutter-l vd-g-s-up-1">
            {taskService
              .getTasks()
              .map((task, i) => (
                <Task key={i} classes="vd-g-col" task={task} />
              ))}
          </div>
        )}
      </div>
    );
  }
}

export default Tasks;
