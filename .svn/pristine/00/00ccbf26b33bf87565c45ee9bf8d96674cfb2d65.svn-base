import React from 'react'
import { Layout, Menu, Icon, Breadcrumb} from 'antd';
import {NavLink} from 'react-router-dom'
import {connect} from 'react-redux'
import {switchMenu } from './redux/action'
import './style/common.less'

const { Header, Sider, Content } = Layout; 
const SubMenu = Menu.SubMenu;

class MainLayout extends React.Component{

    state = {
        collapsed: false,
        currentKey:'',
        breadname: ''
    };

    componentWillMount(){
        let currentKey = window.location.hash.replace('/#|\?.*$/g',''); 
        this.setState({currentKey})
    }
    
    toggle = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
    }
 
    
    renderSubMenu = (data,parentName)=>{
        if(!data) return ''; 
        return data.map((item)=>{
             if(item.menuList){
                 return (
                     <SubMenu title={<span><Icon type="appstore" /><span>{item.name}</span></span>}  key={item.url}>
                         {this.renderSubMenu(item.menuList,item.name)}
                     </SubMenu>
                 ) 
             } 
            return <Menu.Item title={item.name} key={item.url} breadname={parentName + '/' +item.name}>
                        <NavLink to={item.url}></NavLink>{item.name}
                    </Menu.Item>
              
        })
    }

    renderMenu = (menu) =>{
        if(!menu) return '';
        return menu.map((item)=>{
            return <SubMenu title={<span><Icon type="appstore" /><span>{item.sname}</span></span>} key={item.sid} >
                        {this.renderSubMenu(item.menuList, item.name)}
                    </SubMenu>
        });
        
    }

    handleClick = (item)=>{
        // debugger;
        
        const _item = item;
        const {dispatch} = this.props;
        dispatch(switchMenu(_item.item.props.title))
        this.setState({
            currentKey:item.key,
            breadname:_item.item.props.breadname
        })
 
    }

    onCollapse = (collapsed) => { 
        this.setState({ collapsed });
      }


    breadcrumbShow = ()=>{
        const   {breadname} = this.state; 
        return  breadname.split("/").map((item)=>{
            return <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>;
        });
        
    }
    render() {
        const {navMenu,routes, params} = this.props;   
        return (
          <Layout style={{ minHeight: '100vh' }}>
            <Sider
            //   trigger={null}
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
            >
                <div className="logo">
                    <img src="./static/logo.svg" alt=""></img>
                    <span hidden={false}>顺德新港</span>
                </div>
                <Menu 
                    onClick={this.handleClick}
                    selectedKeys={[this.state.currentKey]}
                    mode="inline"
                    inlineCollapsed={false}
                    defaultOpenKeys={['M00000','M00002','/yybd/truck','/yybd/fee','/yybd/pay']}
                    theme="dark">
                    {this.renderMenu(navMenu)}
                </Menu>
            </Sider>
            <Layout>
              <Header style={{ background: '#fff', padding: 0 }}>
                {/* <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                /> */}
              </Header>
              <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }} routes={routes} params={params}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    {this.breadcrumbShow()}
                </Breadcrumb>
                {/* <div style={{ padding: 24, background: '#fff', minHeight: 360 }}> */}
                    {this.props.children}
                {/* </div> */}
            </Content>
              
            </Layout>
          </Layout>
        );
      }
}

const mapStateToProps = state =>{
    return {
        navMenu:state.menu
    }
}

export default connect(mapStateToProps)(MainLayout);