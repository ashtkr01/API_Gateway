const express = require('express');

const axios = require('axios');

const morgan = require('morgan');

const rateLimit = require('express-rate-limit');

const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = 3005;

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 5, // Limit each IP to 5 requests per `window` (here, per 2 minutes)
});

app.use(morgan('combined'));
// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use('/bookingservice', async (req , res , next)=>{
    console.log(req.headers["x-access-token"]);
    try {
        const response = await axios.get('http://localhost:3001/authService/api/v1/isAuthenticated' , {
            headers : {
                "x-access-token" : req.headers["x-access-token"]
            }
        });
        console.log(response.data);
        console.log("Call AuthService");
        if(response.data.success){
            console.log("Hello");
            next();
        }
        else{
            return res.status(401).json({
                message: "Not a valid user so can'not be directed to booking service",
                success: false,
            })
        }   
    } catch (error) {
        return res.status(401).json({
            message: "Not a valid user so can'not be directed to booking service",
            success: false,
        });
    }    
});
app.use('/bookingservice', createProxyMiddleware({ target: 'http://localhost:3002'}));

app.use('/authService', createProxyMiddleware({ target: 'http://localhost:3001'}));


app.use('/flightService', createProxyMiddleware({ target: 'http://localhost:3000'}));



app.get('/home', (req , res) =>{
    return res.json({
        message : "OK"
    });
});

app.listen(PORT , () => {
    console.log(`Server started at port ${PORT}`);
});