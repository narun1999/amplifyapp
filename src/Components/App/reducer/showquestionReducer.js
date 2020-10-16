export default (state = false, action) => {
    switch(action.type){
        case 'SHOW_QUESTION':
            return true
        case 'HIDE_QUESTION':
            return false
        default:
            return state;
    }
}
