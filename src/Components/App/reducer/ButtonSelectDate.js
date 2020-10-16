export default (state = true, action) => {
    switch(action.type){
        case 'DATE_IS_SUCCESS':
            return true
        case 'DATE_IS_ON_PROGRESS':
            return false
        default:
            return state;
    }
}