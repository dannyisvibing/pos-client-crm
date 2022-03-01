import React, { Component } from 'react';
import { RBFlag } from '../../../../rombostrap';

class Task extends Component {
  state = {};

  componentWillMount() {
    const { task } = this.props;
    this._updateTaskVisibility();
    this._onStateChange = () => this._updateTaskVisibility();
    task.on('stateChange', this._onStateChange);
    this._onUpdate = () => this.forceUpdate();
    task.on('update', this._onUpdate);
  }

  componentDidMount() {
    const { task } = this.props;
    if (task.isNew()) {
      this.taskRef.classList.add('ds-task--new');
      setTimeout(() => {
        this.taskRef.classList.remove('ds-task--new');
      }, 500);
    }
  }

  componentWillUnmount() {
    const { task } = this.props;
    task.off('stateChange', this._onStateChange);
    task.off('update', this._onUpdate);
  }

  _updateTaskVisibility() {
    const { task } = this.props;
    if (task.isDismissed()) {
      this.taskRef.classList.add('ds-dismissed');
      setTimeout(() => {
        this.taskRef.classList.add('hidden');
      }, 500);
    }
    if (!!this.taskRef) {
      this.taskRef.classList.toggle('hidden', !task.isReady());
    }
  }

  render() {
    const { task, classes } = this.props;
    const ChildComponent = task.getMetaData().Component;

    return (
      <div ref={c => (this.taskRef = c)} className={classes}>
        <div className="vd-card ds-task-container">
          <ChildComponent task={task} />
        </div>
        {task.isNew() && <RBFlag classes="ds-task-new-flag">New</RBFlag>}
      </div>
    );
  }
}

export default Task;
