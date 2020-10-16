const axios = require('axios')

export const Scheduled = async (accessToken, form, groupname, DATE) => {
    await axios({
        method: 'put',
        url: `https://employee-satisfaction-su-2d1c4.firebaseio.com/scheduled/TIMEACTION/${DATE}/${groupname}.json`,
        headers: { Authorization: `Bearer ${accessToken}` },
        data: form
    })
        .then(res => {
            console.log('crete success')
            return res.data
        })
        .catch(err => {
            alert(err.message)
        })
    return true
}

