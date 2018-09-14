# Dice Evaporator

Dice Evaporator is a wrapper for the [Evaporate library](https://github.com/TTLabs/EvaporateJS) providing web worker support.

When uploading multiple large files, it is possible for the upload process to lag the main JS thread, by delegating this work to a web worker you can keep your UI snappy.

## Usage

```javascript
import Evaporator from 'dice-evaporator';

const config = {
    // evaporate config
    worker: true // boolean to use worker or not
};

const files = [
    // array of Javascript Files
    // you MUST add an ID to each file, so that it can be track from the worker
    // E.g: files.forEach(file => {file.id = generateId()});
];

Evaporator(config, files)
    .progress((progress, id) => { /* File upload % progress - number between 0 & 1 */})
    .success((id, data, awsObjectKey) => { /* fileGuid, fileData, s3 key/path */})
    .error((reason, id) => { /* error reason, errored file */})
    .start((cancel, id) => { /* function to cancel individual file upload, file id */});
```

## How It Works

![Sequence Diagram](docs/sequence.png?raw=true "Upload Sequence Diagram")
