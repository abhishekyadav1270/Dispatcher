/**
 *  Component: Properties Settings
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table } from 'semantic-ui-react'
import { fetchAllProperties } from '../../../modules/property' 
import { showMessage } from '../../../modules/alerts' 
import UpdateProperty from './updateProperty'
import { convertSecondsToDays } from '../../../utils/lib'

import '../../../styles/settings.scss'

const propTypes = {
  properties: PropTypes.array,
  fetchAllProperties: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired
}

class PropertySettings extends React.Component {

  state = {
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    const {fetchAllProperties, showMessage} = this.props
    const res = await fetchAllProperties()
    if(res.type !== 'success'){
      showMessage(res)
    }
  }

  render () {
    const {properties} = this.props
    if(!properties.length){
      return (
        <div></div>
      )
    }
    return (
      <div className="settings">
      {
        <div>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>S. No.</Table.HeaderCell>
                <Table.HeaderCell>Property</Table.HeaderCell>
                <Table.HeaderCell>Value (in days)</Table.HeaderCell>
                <Table.HeaderCell>Created At</Table.HeaderCell>
                <Table.HeaderCell>Created By</Table.HeaderCell>
                <Table.HeaderCell>Updated At</Table.HeaderCell>
                <Table.HeaderCell>Updated By</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {
                properties.map((property, index) => (
                  <Table.Row key={property.id}>
                    <Table.Cell>{index+1}.</Table.Cell>
                    <Table.Cell>{property.alias}</Table.Cell>
                    <Table.Cell>{convertSecondsToDays(property.value)}</Table.Cell>
                    <Table.Cell>{property.created}</Table.Cell>
                    <Table.Cell>{property.createdBy}</Table.Cell>
                    <Table.Cell>{property.updated}</Table.Cell>
                    <Table.Cell>{property.updatedBy}</Table.Cell>
                    <Table.Cell>
                      {
                        <UpdateProperty init={this.init} properties={properties} selectedProperty={property} />
                      }
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </div>
      }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  properties: state.property.properties
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchAllProperties,
  showMessage
}, dispatch)

PropertySettings.propTypes = propTypes

export default connect(
  mapStateToProps, mapDispatchToProps
)(PropertySettings)