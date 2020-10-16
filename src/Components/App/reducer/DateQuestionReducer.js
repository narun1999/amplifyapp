export default (state = new Date()  , action) => {
    switch(action.type){
        case 'SET_QUESTIONDATE':
            return action.data
        case 'CLEAR_QUESTIONDATE':
            return new Date()
        default:
            return state;
    }
}
