/**
 *  Component: Update Property
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, Header, Form, Modal } from 'semantic-ui-react'
import { updateProperty } from '../../../modules/property'
import { convertSecondsToDays, convertDaysToSeconds } from '../../../utils/lib'
import { showMessage } from '../../../modules/alerts' 
import '../../../styles/settings.scss'

const propTypes = {
  properties: PropTypes.array.isRequired,
  updateProperty: PropTypes.func.isRequired
}

class UpdateProperty extends React.Component {

  state = {
    alias: this.props.selectedProperty.alias,
    value: convertSecondsToDays(this.props.selectedProperty.value),
    showModal: false
  }

  componentDidMount = async () => {
  }

  onChange = (e) => this.setState({[e.target.name]: e.target.value})

  onFormSubmit = async () => {
    const {alias, value} = this.state
    const {properties, updateProperty, selectedProperty, showMessage, init, user} = this.props
    let property = properties.filter(property => property.id === selectedProperty.id)[0]
    property.alias = alias
    property.value = convertDaysToSeconds(value)
    delete property.created
    delete property.createdBy
    delete property.updated
    const res = await updateProperty(property, property.id, user)
    showMessage(res)
    if(res.type==='success'){
      this.closeModal()
      init()
    }
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  render () {
    const {alias, value, showModal} = this.state
    const {selectedProperty} = this.props
    return (
      <Modal size='tiny' onClose={this.closeModal} open={showModal} trigger={<Button size='mini' content='Edit' onClick={() => this.setState({ showModal: true })} />} closeIcon>
        <Header content='Update Property' />
        <Modal.Content>
          <Form onSubmit={this.onFormSubmit}>
            <Form.Field>
              <label>Property Name</label>
              <input disabled value={selectedProperty.name} />
            </Form.Field>
            <Form.Field>
              <label>Property Alias</label>
              <input type="text" name='alias' onChange={this.onChange} value={alias} placeholder='Property Alias' />
            </Form.Field>
            <Form.Field>
              <label>Value (in days)</label>
              <input type="number" name='value' onChange={this.onChange} value={value} placeholder='Value (in days)' />
            </Form.Field>
            <Button size='tiny' primary type='submit'>Submit</Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  updateProperty,
  showMessage
}, dispatch)

UpdateProperty.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(UpdateProperty)