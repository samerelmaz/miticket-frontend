const initialUserState = {
    user: {}
}

export const userReducer = (state = initialUserState, action) => {
    switch (action.type) {
        case 'SAVE_USER_INFO':
            return {
                ...state,
                user: action.payload
            }
        default: 
            return state
    }
}