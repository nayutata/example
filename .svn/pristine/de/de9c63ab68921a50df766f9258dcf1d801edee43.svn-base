import React from 'react'
import MenuConfig from './../../config/menuConfig'
import { Menu, Icon } from 'antd'
import './index.less'
import {NavLink} from 'react-router-dom'
import {connect} from 'react-redux'
import {switchMenu } from '../../redux/action'

const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup


class NavLeft extends React.Component{

    state={
        currentKey:''
    }

    componentWillMount(){
        let currentKey = window.location.hash.replace('/#|\?.*$/g',''); 
        this.setState({currentKey})
    }

   

    renderSubMenu = (data)=>{
        if(!data) return ''; 
        return data.map((item)=>{
             if(item.menuList){
                 return (
                     <SubMenu title={item.name} key={item.url}>
                         {this.renderSubMenu(item.menuList)}
                     </SubMenu>
                 ) 
             } 
             return <Menu.Item title={item.name} key={item.url}>
                        <NavLink to={item.url}></NavLink>{item.name}
                    </Menu.Item>
              
        })
    }

    renderMenu = (menu) =>{
        if(!menu) return '';
        return menu.map((item)=>{
            return <SubMenu title={item.sname} key={item.sid} disabled={true}>
                        {this.renderSubMenu(item.menuList)}
                    </SubMenu>
        });
        
    }

    handleClick = (item)=>{
        // debugger;
        const _item = item;
        const {dispatch} = this.props;
        dispatch(switchMenu(_item.item.props.title))
        this.setState({
            currentKey:item.key
        })
    }

    render(){ 
        const {navMenu} = this.props;   
        return (
            <div >
               <div className="logo">
                <img src="" alt=""/>
                <h1>顺德新港</h1>
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
            </div>
        )
    }
}


const mapStateToProps = state =>{
    return {
        navMenu:state.menu
    }
}

export default connect(mapStateToProps)(NavLeft);