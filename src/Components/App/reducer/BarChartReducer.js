export default (state = {}, action) => {
    switch(action.type){
        case 'SET_BAR':
            return action.data
        case 'CLEAR_BAR':
            return {}
        default:
            return state;
    }
}
