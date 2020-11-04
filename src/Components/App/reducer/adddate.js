  
export default (state = [], action) => {
    switch(action.type){
        case 'ADD_DATE':
            return action.data
        case 'INIT_DATE':
            return []
        default:
            return state;
    }
}