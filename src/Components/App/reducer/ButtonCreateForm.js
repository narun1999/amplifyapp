export default (state = true, action) => {
    switch(action.type){
        case 'IS_SUCCESS':
            return true
        case 'ON_PROGRESS':
            return false
        default:
            return state;
    }
}
