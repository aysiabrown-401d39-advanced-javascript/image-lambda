'use strict';

// dependencies 
const AWS = require('aws-sdk');
const util = require('util');
const sharp = require('sharp');

// thumbnail max width, height will size accordingly
const MAX_WIDTH = 50;

const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
    console.log('Reading options from event: \n', util.inspect(event, {depth: 5}));
    // grabs information from original upload bucket 
    const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '))

    // grabs information for endpoint destination bucket
    const dstBucket = `${srcBucket}-resized`;
    const dstKey = `resized-${srcKey}`;

    // checks for a an image type 
    const typeMatch = srcKey.match(/\.([^.]*)$/);
    if(!typeMatch) {
        console.log('Could not detect the image type');
        return;
    }
    
    // grabs the image from S3 source bucket 
    try {
        const params = {
            Bucket: srcBucket,
            Key: srcKey,
        };
        var originalImg = await s3.getObject(params).promise();
    } catch (error) {
        console.log(error);
        return;
    }

    // Uses sharp to resize the image and save it as buffer
    try {
        var buffer = await sharp(originalImg.Body).resize(MAX_WIDTH).toBuffer();
    } catch (error) {
        console.log(error);
        return;
    }

    // uploads the thumbnail to the final destination bucket 
    try {
        const destparams = {
            Bucket: dstBucket,
            Key: dstKey,
            Body: buffer,
            ContentType: 'image',
        };
        
        const putResult = await s3.putObject(destparams).promise();
    } catch (error) {
        console.log(error);
        return;
    }

    console.log(`Successfully resized ${srcBucket}/${srcKey} and uploaded to ${dstBucket}/${dstKey}`)
    
    
    const response = {
        statusCode: 200,
        body: `${dstKey}`,
    }
}