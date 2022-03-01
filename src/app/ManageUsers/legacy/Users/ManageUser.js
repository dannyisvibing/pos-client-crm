import React, { Component } from 'react';
import Error from '../Layout/Error';
import UserForm from '../Users/Form/UserForm';
import { RBLoader } from '../../../../rombostrap';
import STATE from '../../../../constants/states';
import MESSAGE from '../../constants/messages';

class ManageUser extends Component {
  state = {
    state: STATE.inProgress,
    currentUser: false,
    user: {},
    roles: [],
    outlets: []
  };

  componentWillMount() {
    const { params, canView } = this.props;
    const user = this.getUser();
    const { roles, outlets } = this.props;
    if (!params.create && user && !canView(user)) {
      this.setState({ state: STATE.requestError });
      return;
    }

    this.setState({
      user: user,
      roles: roles,
      outlets: outlets,
      state: STATE.ready
    });
  }

  getUser() {
    const { params, getUserById, activeUser } = this.props;

    if (params.userId) {
      return getUserById(params.userId);
    } else if (!params.create) {
      this.setState({ currentUser: true });
      return activeUser;
    }
  }

  render() {
    const { state, user, outlets, roles, currentUser } = this.state;
    return (
      <div>
        {state === STATE.inProgress && (
          <div className="up-page-loading">
            <RBLoader />
          </div>
        )}
        {state === STATE.ready && (
          <UserForm
            user={user}
            outlets={outlets}
            roles={roles}
            backButton={!currentUser}
          />
        )}
        {state === STATE.error && <Error message={MESSAGE.error.request} />}
        {state === STATE.requestError && (
          <Error message={MESSAGE.error.server} />
        )}
      </div>
    );
  }
}

export default ManageUser;
