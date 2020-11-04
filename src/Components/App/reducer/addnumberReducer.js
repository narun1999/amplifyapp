export default (state = [], action) => {
    switch(action.type){
        case 'ADD_NUM':
            return action.data
        case 'CLEAR_NUM':
            return state
        case 'INIT_NUM':
            return []
        default:
            return state;
    }
}
