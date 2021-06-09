/*
    Name - responseGenerator.ts
    Location - libs/responseGenerator.ts
    Description - Used for sending response with status code, message, error , token and data
*/

// Response Generator with token
const responseGenerator = function (
    error: boolean, message: string, status: number, data: any, res: any,
) {
    const myResponse = {
        error: error,
        message: message,
        status: status,
        data: data,
    };
    res.status(status).json(myResponse);
};

export default responseGenerator;