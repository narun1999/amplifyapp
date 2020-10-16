export default (state = 'INITIAL', action) => {
    switch(action.type){
        case 'SHOW_PROGRESS':
            return true
        case 'HIDE_PROGRESS':
            return false
        case 'NOT_USER':
            return 'not user'
        default:
            return state;
    }
}
