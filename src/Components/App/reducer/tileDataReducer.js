export default (state = [], action) => {
    switch(action.type){
        case 'ADD_TILE':
            return action.data
        case 'CLEAR_TILE':
            return []
        default:
            return state;
    }
}
