export default (state = {}, action) => {
    switch(action.type){
        case 'SET_PIE':
            return action.data
        case 'CLEAR_PIE':
            return {}
        default:
            return state;
    }
}
