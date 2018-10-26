import React from "react";
import {Tabs} from "antd";
import BookingTable from "./BookingTable";
import EmptyService from "./emptyService";
import ReceiVingBox from "./ReceivingBox";
import GetDetailForm from "./GetDetailForm";
const TabPane = Tabs.TabPane;
export default class CntOrderDispatch extends React.Component {

  state = {
    showDetailForm: false, //控制是否显示详情,在返回界面回调为不显示
    record: {}
  }

  // 显示仓单信息
  showDetailForm(record) {
    this.setState({
      record
    }, () => this.setState({
      showDetailForm: true
    }))
  }

  //隐藏仓单信息
  hiddenDetailForm(record) {
    console.info(record)
    this.setState({
      record
    }, () => this.setState({
      showDetailForm: false
    }))
  }

  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1" onChange={this.handleCallback} type="card">
          <TabPane tab="提重（含返重）" key="1">
            {this.state.showDetailForm ? <div ><GetDetailForm hiddenDetailForm={this.hiddenDetailForm.bind(this)} record={this.state.record}/></div> : null}
            <div style={{ display: !this.state.showDetailForm ? 'block' : 'none' }}> <BookingTable showDetailForm={this.showDetailForm.bind(this)}/></div>
          </TabPane>
          <TabPane tab="提空（含返重）" key="2"><EmptyService/></TabPane>
          <TabPane tab="收箱" key="3"> <ReceiVingBox /> </TabPane>
        </Tabs>
      </div>
    );
  }
}