export default (state = [], action) => {
    switch(action.type){
        case 'ADD_FORM':
            return state.concat([action.data])
        case 'DELETE_FORM':
            return state.filter((form) => form.id !== action.id)
        case 'EDIT_FORM':
            return state.map((form) => form.id === action.id ? {...form,editing:!form.editing}:form)
        case 'UPDATE_FORM':
            return state.map((form) => {
                if(form.id === action.id){
                    return{
                        ...form,
                        question: action.data.newquestion,
                        answer: action.data.newanswer,
                        editing: !form.editing
                    }
                }
                else return form
            })
        case 'CLEAR_FORM':
            state = []
            return state;
        default:
            return state;
    }
}
