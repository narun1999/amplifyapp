export default (state = "", action) => {
    switch (action.type) {
      case "ADD_GROUP":
        return action.data
      case "CLEAR_GROUP":
        return state;
      default:
        return state;
    }
  };
  