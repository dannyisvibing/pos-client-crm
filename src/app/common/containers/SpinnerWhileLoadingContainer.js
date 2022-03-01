import { connect } from 'react-redux';
import { branch, renderComponent, compose, lifecycle } from 'recompose';
import { bindActionCreators } from 'redux';
import LoadingThrobber from '../components/LoadingThrobber';
import { setPageLoaded, isPageLoadingSelector } from '../../../modules/app';

export default (pageTag, resolver) => {
  const LoadingComponent = compose(
    connect(null, dispatch =>
      bindActionCreators(
        {
          ...resolver.reducers,
          setPageLoaded
        },
        dispatch
      )
    ),
    lifecycle({
      async componentDidMount() {
        await resolver.resolve(this.props);
        this.props.setPageLoaded(pageTag);
      }
    })
  )(LoadingThrobber);

  return compose(
    connect(state => ({
      isPageLoading: isPageLoadingSelector(pageTag)(state)
    })),
    branch(props => props.isPageLoading, renderComponent(LoadingComponent))
  );
};
