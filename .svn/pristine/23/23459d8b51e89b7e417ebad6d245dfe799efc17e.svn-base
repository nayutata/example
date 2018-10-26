import React from 'react'
import {Tabs} from 'antd'
import NoDevanningList from './NoDevanningList';
import DevanningList from './DevanningList';
 
const TabPane = Tabs.TabPane;

/**
 * 拆箱
 */
export default class CntOrderDetail extends React.Component{

    
  
    render(){
 
      
        return (
            <div>
                
                <div className="content-wrap">

                    <Tabs type="card" 
                        
                        defaultActiveKey="1"
                    >
                        <TabPane tab="拆箱列表" key="1" style={{padding:'10px'}}>
                             <NoDevanningList/>
                        
                        </TabPane>
                        <TabPane tab="已拆箱列表" key="2" style={{padding:'10px'}}>
                            <DevanningList/>
                        </TabPane> 
                    </Tabs>

                    
                </div>
                
            </div>
        );
    }
}
 