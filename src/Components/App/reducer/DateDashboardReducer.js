export default (state = new Date()  , action) => {
    switch(action.type){
        case 'SET_DATE':
            return action.data
        case 'CLEAR_DATE':
            return new Date()
        default:
            return state;
    }
}
