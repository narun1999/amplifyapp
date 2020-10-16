import axios from 'axios';

export default axios.create(
    {
        baseURL:'https://linetest-wtco.firebaseio.com/'
        //baseURL:'https://employee-satisfaction-su-2d1c4.firebaseio.com/dashboard/'
    }
)