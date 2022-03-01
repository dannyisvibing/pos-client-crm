import { connect } from 'react-redux';
import { branch, renderComponent, compose, lifecycle } from 'recompose';
import { bindActionCreators } from 'redux';
import LoadingThrobber from '../components/LoadingThrobber';
import { setModuleLoaded, isModuleLoadingSelector } from '../../../modules/app';

export default (moduleTag, resolver) => {
  const LoadingComponent = compose(
    connect(null, dispatch =>
      bindActionCreators(
        {
          ...resolver.reducers,
          setModuleLoaded
        },
        dispatch
      )
    ),
    lifecycle({
      async componentDidMount() {
        await resolver.resolve(this.props);
        this.props.setModuleLoaded(moduleTag);
      }
    })
  )(LoadingThrobber);

  return compose(
    connect(state => ({
      isModuleLoading: isModuleLoadingSelector(moduleTag)(state)
    })),
    branch(props => props.isModuleLoading, renderComponent(LoadingComponent))
  );
};
