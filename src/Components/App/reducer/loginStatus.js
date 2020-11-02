export default (state = false, action) => {
    switch(action.type){
        case 'loggined':
            return true
        case 'logouted':
            return false
        default:
            return state;
    }
}
