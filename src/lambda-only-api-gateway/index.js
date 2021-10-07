exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    if (event.path === '/deny') {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'text/plain' },
        body: `The page is always forbidden.\n`
      }; 
    } else {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: `Hello from Project API Gateway for WAF testing! You've hit ${event.path}\n`
      };
    }
};