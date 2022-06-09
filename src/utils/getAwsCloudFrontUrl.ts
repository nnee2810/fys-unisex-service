export function getAwsCloudFrontUrl(key: string) {
  return process.env.AWS_CLOUD_FRONT_URL + key
}
