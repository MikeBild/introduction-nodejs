const jsonschema = require('jsonschema');

module.exports = () => {
    return {
        validate: validate,
        validateSync: validateSync,
    };
};

function validate(schema, payload) {
    const result = jsonschema.validate(payload, schema);
    if(!result.valid) {
        const errorResult = new Error('Schema validation error');
        errorResult.schemaValidationErrors = result.errors.map(x => x.message);
        return Promise.reject(errorResult);
    }
    return Promise.resolve({valid: result.valid, errors: []});
}

function validateSync(schema, payload) {
    return jsonschema.validate(payload, schema);
    if(!result.valid) {
        const errorResult = new Error('Schema validation error');
        errorResult.schemaValidationErrors = result.errors.map(x => x.message);
        return Promise.reject(errorResult);
    }
    return Promise.resolve({valid: result.valid, errors: []});
}