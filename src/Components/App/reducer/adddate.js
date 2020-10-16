  
export default (state = [], action) => {
    switch(action.type){
        case 'ADD_DATE':
            return action.data
        
        default:
            return state;
    }
}