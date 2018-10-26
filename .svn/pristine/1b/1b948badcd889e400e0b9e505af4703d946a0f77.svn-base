import React from "react";
import {Tabs} from "antd";
import CntOrderHistory from "./CntOrderHistory";
const TabPane = Tabs.TabPane;
export default class CntOrderDispatch extends React.Component {

  state = {
    record: {}
  }

  mapBusiType = {
    'TZ': "提重（含返重）",
    'TK': "提空（含返重）",
    'SX': "收箱"
  }

  render() {
    return (
      <div>
        <Tabs defaultActiveKey="TZ" onChange={this.handleCallback} type="card">
          {
            Object.keys(this.mapBusiType).map((key) => {
              return <TabPane tab={this.mapBusiType[key]} key={key}>
                <CntOrderHistory busiType={key}/>
              </TabPane>
            })
          }
        </Tabs>
      </div>
    );
  }
}