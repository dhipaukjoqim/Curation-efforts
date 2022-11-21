import React, { Component } from 'react';
import { Segment, Dimmer, Loader, Form, Dropdown, Button, Table, Header, Divider, Card } from 'semantic-ui-react'
import moment from 'moment';
import HeaderContent from './Header';
import axios from "axios";
import { VictoryPie, VictoryLabel } from 'victory';

export default class CurationsPie extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: false,
        date: "",
        formattedDate: "",
        removedPieDate: "",
        oneWeekAgoRemovedPieDate: "",
        removed_documents: [],
        totalRemovedCount: 0,
        userGroupOptions: [],
        userGroupSelected: "",
        userGroupArray: [],
        metaPrevArray: [],
        prevArray: [],
        prevAlertTitlevsType: []
      };
    }

    componentDidMount = () => {
      const currentDate = moment().format('YYYY-MM-DD');
      const currentTime = moment().format('HH:mm')
      const currentDateTime = `${currentDate}T${currentTime}`
      console.log('currentDateTime', currentDateTime);

      const userGroupOptions = [
        { key: 'MYRTLE', value: 'MYRTLE', text: 'MYRTLE' },
        { key: 'NWSLTR', value: 'NWSLTR', text: 'NWSLTR' },
        { key: 'MYO_CI', value: 'MYO_CI', text: 'MYO_CI' },
        { key: 'MASAYUKI', value: 'MASAYUKI', text: 'MASAYUKI' },
        { key: 'DSP_GBD', value: 'DSP_GBD', text: 'DSP_GBD' },
        { key: 'KENTON_STEWART', value: 'KENTON_STEWART', text: 'KENTON_STEWART' },
        { key: 'CHRIS_SCHAUMBURG', value: 'CHRIS_SCHAUMBURG', text: 'CHRIS_SCHAUMBURG' },
        { key: 'JASMINE_CARVALHO', value: 'JASMINE_CARVALHO', text: 'JASMINE_CARVALHO' },
        { key: 'MARK_NIEMASZEK', value: 'MARK_NIEMASZEK', text: 'MARK_NIEMASZEK' },
        { key: 'YUVAL_HAREL', value: 'YUVAL_HAREL', text: 'YUVAL_HAREL' },
        { key: 'JENNY_ALLTOFT', value: 'JENNY_ALLTOFT', text: 'JENNY_ALLTOFT' },
        { key: 'MASATO_YABUKI', value: 'MASATO_YABUKI', text: 'MASATO_YABUKI' },
        { key: 'GAELLE_MERCENNE', value: 'GAELLE_MERCENNE', text: 'GAELLE_MERCENNE' },
        { key: 'JINNY_LEE', value: 'JINNY_LEE', text: 'JINNY_LEE' },
        { key: 'ERNEST_DUAH', value: 'ERNEST_DUAH', text: 'ERNEST_DUAH' },
        { key: 'HAYES_DANSKY', value: 'HAYES_DANSKY', text: 'HAYES_DANSKY' },
        { key: 'JIM_LUTERMAN', value: 'JIM_LUTERMAN', text: 'JIM_LUTERMAN' },
        { key: 'ALAN_MENAGED', value: 'ALAN_MENAGED', text: 'ALAN_MENAGED' },
        { key: 'FULL_UROVANT', value: 'FULL_UROVANT', text: 'FULL_UROVANT' },
        { key: 'SUNOVION_MDD', value: 'SUNOVION_MDD', text: 'SUNOVION_MDD' },
        { key: 'SMPA_RESEARCH', value: 'SMPA_RESEARCH', text: 'SMPA_RESEARCH' },
        { key: 'UROVANT_MARKET_ACCESS', value: 'UROVANT_MARKET_ACCESS', text: 'UROVANT_MARKET_ACCESS' },
      ];

      const userGroupArray = [
        'NWSLTR',
        'MYO_CI',
        'MASAYUKI',
        'DSP_GBD',
        'KENTON_STEWART',
        'CHRIS_SCHAUMBURG',
        'JASMINE_CARVALHO',
        'MARK_NIEMASZEK',
        'YUVAL_HAREL',
        'MYRTLE',
        'JENNY_ALLTOFT',
        'MASATO_YABUKI',
        'UROVANT_MARKET_ACCESS',  
        'GAELLE_MERCENNE',
        'JINNY_LEE',
        'ERNEST_DUAH',
        'JIM_LUTERMAN',
        'ALAN_MENAGED',
        'FULL_UROVANT',
        'SUNOVION_MDD',
        'SMPA_RESEARCH'
      ]

      this.setState({
        date: currentDateTime,
        removedPieDate: currentDateTime,
        formattedDate: currentDate.split('T')[0],
        userGroupOptions,
        userGroupArray
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

    modifyDate = (givenDate) => {
      let date = moment(new Date(givenDate)).subtract(7, "days").format();
      date = moment(date).utc()._i;
      let datePart = date.split('T')[0] + "T00:00";
      // console.log("datePart", datePart);

      return datePart;
    }
 
    fetchMETAPrevCurations = async() => {
      this.setState({
        loading: true,
        oneWeekAgoRemovedPieDate: this.modifyDate(this.state.removedPieDate)
      }, async() => {
        let response = await axios
        .post('http://localhost:5000/meta_prev', this.state);
        console.log("response", response)

        this.setState({
          ...this.state,
          metaPrevArray: response.data,
          loading: false
        })
      })
    }

    preparePrevArray = (prevObject) => {
      let prevArray = [];
      for (const property in prevObject) {
        let obj = {};
        obj.x = property;
        obj.y = prevObject[property]
        //console.log(`${property}: ${object[property]}`);

        prevArray.push(obj);
      }

      return prevArray;
    }

    preparePrevAlertvsType = (prevObject) => {
      let prevArray = [];
      for (const property in prevObject) {
        let obj = {};
        let alertTitle = property.split(':')[0];
        let type = property.split(':')[1];

        obj.x = alertTitle;
        obj.y = type
        prevArray.push(obj);
      }

      return prevArray;
    }

    fetchPrevCurations = async() => {
      this.setState({
        loading: true,
        oneWeekAgoRemovedPieDate: this.modifyDate(this.state.removedPieDate)
      }, async() => {
        let response = await axios
        .post('http://localhost:5000/prev', this.state);
        console.log("response", response)

        this.setState({
          ...this.state,
          prevAlertTitlevsType: this.preparePrevAlertvsType(response.data),
          prevArray: this.preparePrevArray(response.data),
          loading: false
        })
      })
    }

    handleChange = (e, data) => {
      this.setState({
        ...this.state,
        [data.name]: data.value
      });
    };

    renderMETAPrevPie = () => {
      return (
        <div style={{ marginTop: "50px", marginLeft: "50px"}}>
          <Header as='h3'>META Previous Curations Pie chart</Header>
          {/* <div style={{ width: "600px", height: "700px", top: 30, left: 120, position: "relative", padding: "50px"}}> 
            <VictoryPie
              data={this.state.metaPrevArray}
              labels={({ datum }) => `${datum.x}`}
              labelPosition={({ index }) => index
                ? "centroid"
                : "startAngle"
              }
              labelPlacement= "parallel"
              colorScale={[ "tomato", "orange", "gold", "cyan", "navy" ]}
              // data={[
              //   { x: "Cats", y: 35 },
              //   { x: "Dogs", y: 40 },
              //   { x: "Birds", y: 55 }
              // ]}
              style={{ labels: { padding: 30 } }}
            />
          </div>       */}
          <svg viewBox="0 0 400 500">
            <VictoryPie
              standalone={false}
              width={300} height={500}
              data={this.state.metaPrevArray}
              // labelRadius={50}
              labels={({ datum }) => `${datum.x}(${datum.y}%)`}
              labelPosition={({ index }) => index
                ? "centroid"
                : "startAngle"
              }
              labelPlacement= "parallel"
              colorScale={[ "tomato", "orange", "cyan", "navy", "gold" ]}
              style={{ labels: { fontSize: 6} }}
            />
          </svg>
        </div>
      )
    }

    renderPrevPie = () => {
      return (
        <div style={{ marginTop: "20px"}}>
          <Header as='h3'>Previous Curations Pie chart for {this.state.userGroupSelected}</Header>
          <div style={{ width: "500px", height: "900px", top: -130, left: 120, position: "relative"}}> 
            <VictoryPie
              data={this.state.prevArray}
              labels={({ datum }) => `${datum.x}`}
              labelPosition={({ index }) => index
                ? "centroid"
                : "startAngle"
              }
              labelPlacement={({ index }) => index
                ? "parallel"
                : "vertical"
              }
              colorScale={["tomato", "orange", "gold", "cyan", "navy" ]}
              // data={[
              //   { x: "Cats", y: 35 },
              //   { x: "Dogs", y: 40 },
              //   { x: "Birds", y: 55 }
              // ]}
            />
          </div>
        </div>
      )
    }
    
    renderPrevTable = () => {
      console.log("inside render Prev table")
      let prevArray = this.state.prevArray;
      return (
        <div style={{ marginTop: "60px", marginBottom: "30px"}}>
          <Header as='h3'>Previous Curations for {this.state.userGroupSelected}</Header>
          <Table 
            singleLine 
            striped 
            style={{ overflowY: "scroll", height: "300px", width: "950px", display: "block", marginBottom: "30px"}}
          >
          <Table.Header style={{position: "sticky", top: 0, zIndex: 1}}>
            <Table.Row>
              <Table.HeaderCell textAlign="center">Alert title</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Count</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Overall %</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Type %</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Alert & Type %</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {prevArray.length > 0 && 
              prevArray.map((curr, index) => (
                <Table.Row key={index}>
                    <Table.Cell textAlign="center">
                      {prevArray[index].x}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {prevArray[index].y}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {/* Count of each title / total rows in table */}
                      {((prevArray[index].y/prevArray.length)*100).toFixed(2)}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {/* Count of each title / total count of rows with current index's type */}
                      {((prevArray[index].y / this.returnTotalTypeCount(prevArray[index].x.split(':')[1])) * 100).toFixed(2)}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {/* Count of each title / total count of rows with current index's type as well as current index containing the alert type*/}
                      {((prevArray[index].y / this.returnTotalAlertTypeCount(this.state.userGroupSelected, prevArray[index].x.split(':')[1])) * 100).toFixed(2)}
                    </Table.Cell>
                </Table.Row>
              ))
            }
            </Table.Body>
          </Table>
        </div>   
      )
    }

    returnTotalTypeCount = (indexType) => {
      console.log("indexType", indexType)
      let count = 0;
      for(let object of this.state.prevAlertTitlevsType) {
        if(object.y==indexType) {
          count++;
        }
      }

      return count;
    }

    returnTotalAlertTypeCount = (alertGroup, indexType) => {
      console.log("indexType", indexType)
      console.log("alertGroup", alertGroup)
      let count = 0;
      for(let object of this.state.prevAlertTitlevsType) {
        console.log("object", object)
        if(object.x.includes(alertGroup) && object.y==indexType) {
          count++;
        }
      }

      console.log("count", count)
      return count;
    }

    render() {
      console.log("state in CurationsPie", this.state)
      return (
        <div style={{ alignItems: "center"  }}>
          {this.state.loading && (
            <Segment style={{ marginTop: '40px', height: '400px', marginRight: "50px"}}>
              <Dimmer active inverted>
                <Loader inverted content='Loading' />
              </Dimmer>
            </Segment>
          )}
          {!this.state.loading && (
            <div style={{ marginRight: "100px"}}>
              <Form>
                <Form.Field inline>
                  <label style={{ marginRight: "15px"}}>Date range</label>
                  <input 
                    type="datetime-local" 
                    value={this.state.removedPieDate}
                    name="removedPieDate"
                    onChange={this.handleInputChange}
                    step="1"
                  />
                  <Button style={{ marginLeft: "20px"}} primary onClick={this.fetchMETAPrevCurations}>Fetch META Previous Curations</Button>
                </Form.Field>
              </Form>
              
              {this.state.metaPrevArray.length>0 && this.renderMETAPrevPie()}

              <Form>
                <Form.Field inline>
                  <label style={{ marginRight: "15px", marginTop: "30px"}}>User Group</label>
                  <Dropdown
                    name = 'userGroupSelected'
                    placeholder='Select User group'   
                    selection
                    search
                    options={this.state.userGroupOptions} 
                    onChange={this.handleChange}
                    value={this.state.userGroupSelected}
                  />
                  <Button style={{ marginLeft: "40px"}} primary onClick={this.fetchPrevCurations}>Fetch Previous Curations for User Group</Button>
                </Form.Field>
              </Form>
              <br />

              {/* {this.state.prevArray.length>0 && this.renderPrevPie()} */}
              {this.state.prevArray.length>0 && this.renderPrevTable()}
              {/* {this.state.prevArray.length==0 && (
                <div>
                  Data fetched returned empty
                </div>
              )} */}
            </div>
          )}
        </div>
      );
      }
}