import {type} from '../action'

const initialState = {
    menuName : '首页',
    // userInfo: {}
}

export default (state = initialState,action)=>{ 

    switch(action.type){
        case type.SWITCH_MENU:
            return {
                ...state,
                menuName:action.menuName
            } 
        case type.SAVE_USERINFO:
            return {
                ...state,
                userInfo:action.userInfo,
                menu:action.menu,
                permission:action.permission
            } 
        case type.UPDATE_DICT:
            return {
                ...state,
                ... action.payload
            } 
        default:
            return {
                ...state
            } 
    }
}