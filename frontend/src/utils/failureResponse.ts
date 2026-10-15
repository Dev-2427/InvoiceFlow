export function failureResponse(message = "Something went wrong, please try again.") {
    return {
        success: false,
        message
    }
}