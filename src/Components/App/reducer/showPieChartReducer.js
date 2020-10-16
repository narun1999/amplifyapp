export default (state = false, action) => {
    switch(action.type){
        case 'SHOW_PIE':
            return true
        case 'HIDE_PIE':
            return false
        default:
            return state;
    }
}
