# Image-Lambda Lab
### Aysia Brown


## Resources 
- Followed this tutorial from the [AWS Docs](https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example.html) (Shoutout to Matt for posting this in Slack!)
    - Line comments were added for my own understanding of figuring out what the tutorial code was doing
- Unsplash Test Photo [Credit](https://unsplash.com/photos/jwqgM5o6TVM)

## Lambda Function Functionality 
- this lambda function utilizes the awd-sdk to access the S3 buckets, sharp to resize and util.
- The lambda function takes an image upon upload from the S3 bucket `aeb-image-lambda` and resizes it proportionately with a new width of 50px. The new image is then stored into a secondary destination bucket `aeb-image-lambda-resized`
    - the function assumes that the destination bucket is named `originalBucket-resized`
    - the function renames the resized image as `resized-imagename.jpg`

### Examples

Original uploaded image:

![Tiger](./assets/tiger.jpg)

Thumbnail image created:

![Tiger Thumb](./assets/resized-tiger.jpg)

### Troubleshooting
- I uploaded my lambda function as a .zip, and like the Elastic Beanstalk .zip upload, I thought you weren't supposed to package the node_modules folder with it. It turns out you are if you want your function to run. 
- Another issue I ran into was that my bucket and lambda function were not created in the same region. Rectified this by deleting my first lambda function and recreating it in the proper region.
- Tested the lambda function live by uploading another image to the `aeb-image-lambda` bucket and the event trigger was a success!