export default (state = false, action) => {
    switch(action.type){
        case 'SHOW_FORM':
            return true
        case 'HIDE_FORM':
            return false
        default:
            return state;
    }
}
