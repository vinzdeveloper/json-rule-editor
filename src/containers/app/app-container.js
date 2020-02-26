import React from 'react';
import { connect } from 'react-redux';
import Title from '../../components/title/title';
import NavigationPanel from '../../components/navigation/navigation-panel';
import AppRoutes from '../../routes/app-routes';


const AppContainer = () => (
    <React.Fragment>
      <Title title={'Rule Editor'} />
      <NavigationPanel />
      <AppRoutes />
    </React.Fragment>
);


const mapStateToProps = state => ({
    name: state.app.name,
});

const mapDispatchToProps = () => ({
    handleClick: () => {
        return false;
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);