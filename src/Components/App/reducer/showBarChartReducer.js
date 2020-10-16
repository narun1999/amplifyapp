export default (state = false, action) => {
    switch(action.type){
        case 'SHOW_BAR':
            return true
        case 'HIDE_BAR':
            return false
        default:
            return state;
    }
}
