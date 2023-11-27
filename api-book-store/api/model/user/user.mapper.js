const dateTimeUtil = require('../../../util/dateTime.util.js')
const SuccessResponse = require('../base/success.response.js')
const ErrorResponse = require('../base/error.response.js')

const userMapper = function(data, isSignal = false) {
    try {

        const mapper = data.map(item => {
            const mapping = {}

            mapping['id'] = item.user_id
            mapping['firstName'] = item.user_first_name
            mapping['lastName'] = item.user_last_name
            mapping['email'] = item.user_email
            mapping['password'] = item.user_password
            mapping['dateOfBirth'] = dateTimeUtil.formatDate(item.user_dob)
            mapping['address'] = item.user_address
            mapping['phoneNumber'] = item.user_phone_number
            mapping['role'] = getRoleData(item.user_role)

            return mapping
        })

        if (isSignal) {
            return SuccessResponse.getBaseSuccess(mapper[0])
        }

        return SuccessResponse.getBaseSuccess(mapper)
        
    } catch (error) {
        console.log(error)
        return ErrorResponse.getServerError(`Internal mapper error: ${error}`)
    }
}

function getRoleData(role) {
    if (role == 1) {
        return {
            id: 1,
            name: `STAFF`
        }
    } else if (role == 2) {
        return {
            id: 2,
            name: `USER`
        }
    } else {
        return {
            id: 2,
            name: `USER`
        }
    }
}

module.exports = {
    userMapper
}