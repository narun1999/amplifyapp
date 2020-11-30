import { combineReducers } from 'redux'
import addnumberReducer from './addnumberReducer'
import formReducer from './formReducer'
import showformReducer from './showformReducer'
import showquestionReducer from './showquestionReducer'
import GroupNameReducer from './GroupNameReducer'
import ButtonCreateForm from './ButtonCreateForm'
import showgraphReducer from './showgraphReducer'
import DashboardReducer from './DashboardReducer'
import ChartTypeReducer from './ChartTypeReducer'
import PieChartReducer from './PieChartReducer'
import showPieChartReducer from './showPieChartReducer'
import BarChartReducer from './BarChartReducer'
import showBarChartReducer from './showBarChartReducer'
import DateDashboardReducer from './DateDashboardReducer'
import ButtonSelectDate from './ButtonSelectDate'
import adddate from './adddate'
import DateQuestionReducer from './DateQuestionReducer'
import tileDataReducer from './tileDataReducer'


export default combineReducers({
    adddate,
    addnumberReducer,  
    formReducer,
    showformReducer,
    showquestionReducer,
    GroupNameReducer,
    ButtonCreateForm,
    showgraphReducer,
    DashboardReducer,
    ChartTypeReducer,
    PieChartReducer,
    showPieChartReducer,
    BarChartReducer,
    showBarChartReducer,
    DateDashboardReducer,
    ButtonSelectDate,
    DateQuestionReducer,
    tileDataReducer,
})