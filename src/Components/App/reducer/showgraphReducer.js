export default (state = false, action) => {
    switch(action.type){
        case 'SHOW_GRAPH':
            return true
        case 'HIDE_GRAPH':
            return false
        default:
            return state;
    }
}
