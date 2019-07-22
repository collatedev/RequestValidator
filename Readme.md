# Request Validator by Collate


## What is this library?

This is an unopinionated request validator that uses a json schema and a custom request object to valdiate that requests. This library will check that your requests have all the desired fields, have no extraneous fields, incorrectly typed fields, and are sanitized using the limited options for sanitization currently availible (more to come + custom sanitization coming soon).

## Getting Started

1. To install this library simply use the npm command
    `npm i @collate/request-validator`

2. (optional) Create a folder in your current node project called 'RequestSchemas'

3. create a file called TestRequest.json

4. Fill it with the following contents

```javascript
{
    types: {
        
    }
}
```

this tells the validator what obejcts it will look for in the request

5. Define your request (root) type

```javascript
{
    types: {
        request: {
            
        }
    }
}
```

6. Fill it with field each field you want on your request

```javascript
{
    types: {
        request: {
            body: {
                required: true,
                type: "number"
            }
        }
    }
}
```

7. Now create a file called main.js in the root directory of your project and fill it with the following code

```javascript
const { ValidationSchema, Validator, RequestBuilder } = require("@collate/request-validator");
const rawSchema = require('./RequestSchema/TestRequest.json') // import your json file

const validator = new Validator(); // create a validator

const schema = new ValidationSchema(rawSchema);

const requestBuilder = new RequestBuilder();
const request1 = requestBuilder.setBody(42).build();
const request2 = requestBuilder.setBody("foo").build();

const validationResult1 = validator.validate(request1, schema);
const validationResult2 = validator.validate(request2, schema);

console.log(validationResult1.isValid()); // true
console.log(validationResult1.errors()); // []
console.log(validationResult2.isValid()); // false
console.log(validationResult2.errors()); // [information regarding the error]
```

8. Now go forth and validate, sanitize, and typecheck to your hearts content (see the following section for a more indepth look at the structure of a schema)

## Schema Structure

All schemas must start with the types property. This tells the validator what types it should look for in the request

```javascript
{
    types: {

    }
}
```

### Types

What are the types in a request you may be asking? That's an excellent question! Essentially, a type is just a description of a nested JSON object in the request that is being validated. For example, consider this json request:

```javascript
{
    body: {
        a: "foo",
        b: true
    }
}
```

The type in this request is the body property of the JSON as it is a JSON object containing the fields "a" and "b". If we were to describe this body in our schema we would do it as such:

```javascript
{
    types: {
        request: {
            body: {
                // field descriptions here
            }
        }
    }
}
```

This indicates that our request object must contain the nested object "body" that has some fields that we will describe in this next section. Also for those curious this would be considered a valid schema as it is describing a JSON request that looks like the following:

```javascript
{
    body: {}
}
```
 
Which is just an empty body

### Fields

This section is the next part of describing how your request should look. Consider the example request that we used in the types subsection above, specifically the body object.

```javascript
body: {
    a: "foo",
    b: true
}
```

In the section aboved we described in the schema that there is some type called body that it should validate, now we need to tell it what to do when it is validating the body type. We do this through field configurations. So to describe the above example we would write the following schema.

```javascript
{
    types: {
        request: {
            body: {
                required: true,
                type: "Body"
            }
        },
        Body: {
            a: {
                required: true,
                type: "string"
            }
            b: {
                required: true,
                type: "boolean"
            }
        }
    }
}
```

This schema fully describes a request that looks like 

```javascript
{
    body: {
        a: "string",
        b: true
    }
}
```

Through the field configuration we can tell the validator what type each field of the request should be as well as whether or not the field is required. These two properties are required for every field configuiration.

The valid types for a field configuration are as follows
`"string", "boolean", "number", "any", "enum", "[SchemaType]", "array[//any of the previous types or another array]"`

#### Enums

Enums are one of the unique types that the validator looks for, to do that you must define a property called "values" on the fields that you want to be enums. For example: 

```javascript
{
    types: {
        request: {
            body: {
                required: true,
                type: "Body"
            }
        },
        Body: {
            a: {
                required: true,
                type: "enum",
                values: ["A", "B"]
            }
        }
    }
}
```

This schema defines a request where the property "a" on the body of the request can only be the string values of either A or B.

---

#### Arrays

Arrays are special because they can have the field properties of their elements types on them so that the value of an array (nested or not) can be sanitized by a normal field configuration.

```javascript
{
    types: {
        request: {
            body: {
                required: true,
                type: "Body"
            }
        },
        Body: {
            a: {
                required: true,
                type: "array[string]",
                length: 2
            }
        }
    }
}
```

This example schema demonstrates how the an array of strings will be validated only if its elements consists of strings that are of length 2

---

The optional properties that can be added to field configurations are sanitization options, which will be described in the following section

### Sanitization Options

Currently there is a very limited set of sanitization options, however, this list will continue to grow and will also allow for custom sanitizations. This will most likely be a version 2 feature of this library as we would like to modularize the sanitization options to reduce friction.

The current sanitization options for fields  are as follows

#### length

Works on types: `["string"]`
Description: Checks the length of a string
Format: `length: number`
Example: `length: 1 // checks if the length is 1` 

---

#### startsWith

Works on types: `["string"]`
Description: Checks the if the strings starts with some substring
Format: `startsWith: string`
Example: `startsWith: "foo" // checks if a string starts with foo` 

---
#### isURL

Works on types: `["string"]`
Description: Checks if the string is a URL
Format: `isURL: boolean`
Example: `isURL: true // checks if the string is a URL` 

---
#### range

Works on types: `["number"]`
Description: Checks if the number is in a certain range
Format: `range: array[2], range[0] = number, range[1] = number`
Example: `range: [0, 100] // checks if the number is within the range 0 (inclusive) to 100 (inclusive)` 

---
#### arrayLengths

Works on types: `["array"]`
Description: Checks that the array has the expected lengths. This property will check if you have a nested array that each nested array will have the correct length depending on its nesting depth .
Format: `arrayLengths: array[totalDepth], array[depth] = number`
Example: `arrayLengths: [1, 1, 1] // checks that the array is of form '[[1], [1], [1]]'` 

---