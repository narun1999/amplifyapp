export default (state = '', action) => {
    switch(action.type){
        case 'HANDLE_BAR':
            return 'Bar Chart'
        case 'HANDLE_PIE':
            return 'Pie Chart'
        default:
            return state;
    }
}
