export default (state = {}, action) => {
    switch(action.type){
        case 'SET_DASHBOARD':
            return action.data
        case 'CLEAR_DASHBOARD':
            return {}
        default:
            return state;
    }
}
