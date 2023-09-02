/**
 *  Component: 'requireAuth'
 *  A higher order component (HOC) that wraps other components to allow
 *  the components access only if the user is authenticated
 */

import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

export default function(ComposedComponent) {

  const propTypes = {
    navigateToLogin: PropTypes.func.isRequired,
    authenticateUser: PropTypes.func,
    user: PropTypes.object,
    isAuthenticated: PropTypes.bool
  }

  class Authenticate extends React.Component {

    componentWillMount = async () => {
      const { navigateToLogin, isAuthenticated } = this.props
      // const session = localStorage.getItem("session")
      if(!isAuthenticated){
        // if (session) {
          // await authenticateUser(null, JSON.parse(session))
        // }
        // if(!this.props.isAuthenticated) {
          navigateToLogin()
        // } else {
          // socket connection
          // const socket = setupSocket(store.dispatch, this.props.user)
          // sagaMiddleware.run(handleNewMessage, { socket })
        // }
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      )
    }
  }

  const mapStateToProps = state => ({
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated
  })

  const mapDispatchToProps = dispatch => bindActionCreators({
    navigateToLogin: () => push('/login')
  }, dispatch)

  Authenticate.propTypes = propTypes

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Authenticate)
}
