import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
  
import Home from './pages/home' 
import NoMatch from './pages/nomatch' 
import { TruckCompany } from './pages/truckCompany'
import { TruckHistory } from './pages/truckHistory'
import CntOrderDetail from './pages/CntOrderDetail'  
import { connect } from 'react-redux'
import { saveUserInfo } from './redux/action'
import CntOrderDispatch from './pages/cntOrderDispatch'
import TruckCompanyManage from './pages/truckCompanyManage' 
import TruckRecord from './pages/truckRecord'
import axios from './axios'
import MainLayout from './layout'
import FeeConfigure from './pages/FeeConfigure'
import FeeOrderDetail from './pages/FeeOrderDetail'
import OrderStatus from './pages/orderStatus/OrderStatus'
import refundCheckOrder from './pages/refundCheckOrder/RefundCheckOrder'
import cntOrderHistort from './pages/cntOrderHistory'
import CntOrderDetailHistory from './pages/cntOrderHistory/CntOrderDetailHistory'

class IRouter extends React.Component {

    checkLogin = () => {

        const { dispatch, userInfo, menu } = this.props;

        console.log(userInfo, menu);

        if (!userInfo) {
            axios.ajax({
                baseURL: 'http://sdxg.szgber.net',
                url: 'yybd/auth/current?requestUrl=http://localhost:3000',
                method: 'GET'
            }).then((data) => {
                dispatch(saveUserInfo(data.data.entity, data.data.entity.menu, data.data.entity.permission))
            })
        } else {

        }
    }

    componentDidMount() {
        this.checkLogin();
    }


    render() {
        return (

            <HashRouter>
                <Switch>
                    <Route  path="/" render={() =>
                        <MainLayout>
                            <Switch>
                                <Route path="/home"  component={Home}></Route>
                                <Route path="/yybd/cntOrderDetail" component={CntOrderDetail}></Route>
                                <Route path="/yybd/cntOrder_rm" component={CntOrderDispatch}></Route>
                                <Route path="/yybd/truck_rem" component={TruckRecord}></Route> 
                                <Route path="/yybd/truck_Company_rem" component={TruckCompanyManage}></Route>
                                <Route path="/yybd/cntOrder_listHistory" component={cntOrderHistort}></Route>
                                <Route path="/cntOrderDetailHistory" component={CntOrderDetailHistory}></Route>
                                <Route path="/yybd/feeConfigure" component={FeeConfigure}></Route>
                                <Route path="/yybd/feeOrderDetail" component={FeeOrderDetail}></Route> 
                                <Route path="/yybd/truckCompany" component={TruckCompany}></Route>
                                <Route path="/yybd/truck_history" component={TruckHistory}></Route>

                                <Route path="/yybd/syncOrder_m" component={OrderStatus}></Route>
                                <Route path="/yybd/refundCheckOrder" component={refundCheckOrder}></Route>

                                
                                <Redirect to="/home" />
                                <Route component={NoMatch} />
                            </Switch>
                        </MainLayout>
                    } />
                </Switch>
            </HashRouter>

        );
    }
}


const mapStateToProps = state => {
    return {
        userInfo: state.userInfo,
        menu: state.menu
    }
}

export default connect(mapStateToProps)(IRouter);