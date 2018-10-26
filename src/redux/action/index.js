import axios from '../../axios/index'

export const type ={
    SWITCH_MENU:'SWITCH_MENU',
    SAVE_USERINFO: 'SAVE_USERINFO', 
    UPDATE_DICT: 'UPDATE_DICT'
}

export function switchMenu(menuName){
    return {
        type: type.SWITCH_MENU,
        menuName
    }
}

export function saveUserInfo(userInfo,menu,permission){
    return {
        type: type.SAVE_USERINFO,
        userInfo,
        menu,
        permission
    }
}

//获取远程数据字典的数据
export const getDictList = (dictKey,storeKey) => {
    const sk = storeKey;
	return (dispatch) => {   
        axios.ajax({
            url:'yybd/common/dictList', 
            data:{
                params:{
                    group:dictKey
                }
            }
        }).then((res)=>{ 
            if(res.code == '200'){    
                let dictData = {}
                let _storeKey = sk||dictKey;
                dictData[_storeKey] = res.data.list[0].data
                dispatch(updateDict(dictData)); 
            }
        })
	}
}

//更新到store
const updateDict = (dictData) => ({
	type: type.UPDATE_DICT,
	payload: dictData
});


