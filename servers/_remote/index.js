// Deployed on AWS Lambda
exports.handler = async (event) => {
    
    const response = {
        statusCode: 200,
        body: JSON.stringify({type:'fail-random-remote'}),
    };
    
    const error = {
        statusCode: 502,
        body: JSON.stringify({error: 'Random error ocurred'}),
    };
    
    return Math.random()> 0.5 ? response : error;
};
