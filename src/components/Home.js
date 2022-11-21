import React, { Component } from 'react';
import { Segment, Dimmer, Loader, Form, Dropdown, Button, Table, Header, Divider, Card } from 'semantic-ui-react'
import moment from 'moment';
import HeaderContent from './Header';
import axios from "axios";
import CurationsPie from './CurationsPie';

export default class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: false,
        date: "",
        formattedDate: "",
        removedPieDate: "",
        oneWeekAgoRemovedPieDate: "",
        removed_documents: [],
        totalRemovedCount: 0
      };
    }

    componentDidMount = () => {
      const currentDate = moment().format('YYYY-MM-DD');
      const currentTime = moment().format('HH:mm')
      const currentDateTime = `${currentDate}T${currentTime}`
      console.log('currentDateTime', currentDateTime);

      this.setState({
        date: currentDateTime,
        removedPieDate: currentDateTime,
        formattedDate: currentDate.split('T')[0]
      })
    }

    prepareResponse = (data) => {
      let removedDocumentArray = [];
      let totalCount = 0;
      for(let doc of data) {
        let object = {};
        object.removal_cause = doc[0];
        object.count = doc[1];
        removedDocumentArray.push(object);

        totalCount += doc[1];
      }

      return { removedDocumentArray, totalCount };
    }

    handleInputChange = (e) => {
      this.setState({
        ...this.state,
        [e.target.name]: e.target.value,
        formattedDate: e.target.value.split('T')[0]
      })
    }

    renderRemovedDocAnalysisTable = () => {
      console.log("inside rederRemovedDocAnalysisTable")
      let removedDocs = this.state.removed_documents;
      return (
        <div style={{ marginTop: "60px"}}>
          <Header as='h3'>Removed Document Analysis</Header>
          <Table 
            singleLine 
            striped 
            style={{ overflowY: "scroll", height: "300px", width: "720px", display: "block"}}
          >
          <Table.Header style={{position: "sticky", top: 0, zIndex: 1}}>
            <Table.Row>
              <Table.HeaderCell textAlign="center">Removal cause</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Document count</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {removedDocs.length === 0 && (
              <Table.Row>
                <Table.Cell colspan="2">
                    <center>Removed causes not available for this time frame</center>
                </Table.Cell>
              </Table.Row>
            )}
            {removedDocs.length > 0 && 
              removedDocs.map((curr, index) => (
                <Table.Row key={index}>
                    <Table.Cell textAlign="center">
                      {removedDocs[index].removal_cause}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {removedDocs[index].count}
                    </Table.Cell>
                </Table.Row>
              ))
            }
            <Table.Row>
              <Table.Cell textAlign="center">
                Total
              </Table.Cell>
              <Table.Cell textAlign="center">
                {this.state.totalRemovedCount}
              </Table.Cell>
            </Table.Row>
            </Table.Body>
          </Table>
        </div>   
      )
    }

    fetchRemovedDocuments = async() => {
      this.setState({
        loading: true
      }, async() => {
        let response = await axios
        .post('http://localhost:5000/', this.state);
        console.log("response", response)
        let preparedResponse = this.prepareResponse(response.data.removed_documents);
        console.log("removedDocArray", preparedResponse.removedDocumentArray) 
        this.setState({
          ...this.state,
          removed_documents: preparedResponse.removedDocumentArray,
          totalRemovedCount: preparedResponse.totalCount,
          loading: false
        })
      })
    }

    modifyDate = (givenDate) => {
      let date = moment(new Date(givenDate)).subtract(7, "days").format();
      date = moment(date).utc()._i;
      let datePart = date.split('T')[0];
      console.log("datePart", datePart);

      return datePart;
    }

    render() {
      console.log("state in Home", this.state)
      return (
        <div style={{ marginLeft: "50px", alignItems: "center"  }}>
          {this.state.loading && (
            <Segment style={{ marginTop: '40px', height: '400px', marginRight: "50px"}}>
              <Dimmer active inverted>
                <Loader inverted content='Loading' />
              </Dimmer>
            </Segment>
          )}
          {!this.state.loading && (
            <div style={{ marginRight: "100px"}}>
              <HeaderContent />
              <Form>
                <Form.Field inline>
                  <label style={{ marginRight: "15px"}}>Date range</label>
                  <input 
                    type="datetime-local" 
                    value={this.state.date}
                    name="date"
                    onChange={this.handleInputChange}
                    step="1"
                  />
                  <Button style={{ marginLeft: "20px"}} primary onClick={this.fetchRemovedDocuments}>Fetch Removed Documents</Button>
                </Form.Field>
              </Form>
              {this.state.removed_documents.length>1 && this.renderRemovedDocAnalysisTable()}
              <Divider />
              <CurationsPie />
            </div>
          )}
        </div>
      );
      }
}