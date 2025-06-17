const express = require('express');
const axios = require('axios');
const CircuitBreaker = require('opossum');
const NodeCache = require('node-cache');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const axiosRetry = require('axios-retry').default;

const app = express();
const cache = new NodeCache({ stdTTL: 60 }); // Cache responses for 60 seconds

// Middleware
app.use(express.json());
app.use(cors());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(helmet());
app.use(morgan('combined'));


axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });


const define_service = {
    "MCQ_PRIMARY_SERVICE": "http://localhost:4001",
    "MCQ_FALLBACK_SERVICE": "http://localhost:4002",
    "QA_PRIMARY_SERVICE": "http://localhost:4003",
    "QA_FALLBACK_SERVICE": "http://localhost:4004",
}
// Circuit breaker configuration
const circuitBreakerOptions = {
    timeout: 500000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000,
};

const circuitBreaker = new CircuitBreaker((url, body) => axios.post(url, body), circuitBreakerOptions);

const isServiceAlive = async (url) => {
    try {
        const response = await axios.get(url);
        return response.status === 200;
    } catch (error) {
        console.warn(`Health check failed for ${url}:`, {
            message: error.message,
            code: error.code,
            response: error.response ? error.response.data : 'No response data',
        });
        return false;
    }
};


const callServiceWithFallback = async (primaryBaseUrl, fallbackBaseUrl, path, reqBody) => {
    let errors = {};

    // Try primary service
    try {
        if (await isServiceAlive(`${primaryBaseUrl}/health`)) {
            const response = await circuitBreaker.fire(`${primaryBaseUrl}${path}`, reqBody);
            return { data: response.data, status: response.status, errors: null };
        } else {
            errors.primaryService = {
                status_code: 503,
                error: 'Primary service health check failed',
            };
        }
    } catch (error) {
        errors.primaryService = {
            status_code: error.response?.status || 500,
            error: error.response?.data || error.message,
        };
    }

    // Try fallback service
    try {
        if (await isServiceAlive(`${fallbackBaseUrl}/health`)) {
            const response = await circuitBreaker.fire(`${fallbackBaseUrl}${path}`, reqBody);
            return { data: response.data, status: response.status, errors: null };
        } else {
            errors.fallbackService = {
                status_code: 503,
                error: 'Fallback service health check failed',
            };
        }
    } catch (error) {
        errors.fallbackService = {
            status_code: error.response?.status || 500,
            error: error.response?.data || error.message,
        };
    }

    // If both services fail, throw errors object
    errors.message = 'Both services are unavailable';
    throw errors;
};


app.use('/MultipleChoiceGeneration', async (req, res) => {
    try {
        const path = req.path;
        // setTimeout(() => {},100000)
        const { data, status } = await callServiceWithFallback(
            define_service.MCQ_PRIMARY_SERVICE,
            define_service.MCQ_FALLBACK_SERVICE,
            path,
            req.body
        );
        
        res.status(status).json(data);
    } catch (errors) {
        console.error(`Error handling /generateMCQ${req.path}:`, errors);

        res.status(500).json({
            message: 'Error in processing request',
            errors: {
                primaryService: errors.primaryService || null,
                fallbackService: errors.fallbackService || null,
                overallMessage: errors.message || 'Unknown error occurred',
            },
        });
    }
});

app.use('/QuestionAnswering', async (req, res) => {
    try {
        const path = req.path;
        const { data, status } = await callServiceWithFallback(
            define_service.QA_PRIMARY_SERVICE,
            define_service.QA_FALLBACK_SERVICE,
            path,
            req.body
        );
        res.status(status).json(data);
    } catch (errors) {
        console.error(`Error handling /generateMCQ${req.path}:`, errors);

        res.status(500).json({
            message: 'Error in processing request',
            errors: {
                primaryService: errors.primaryService || null,
                fallbackService: errors.fallbackService || null,
                overallMessage: errors.message || 'Unknown error occurred',
            },
        });
    }
});

// Health check endpoint for the gateway
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Gateway is healthy' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});
