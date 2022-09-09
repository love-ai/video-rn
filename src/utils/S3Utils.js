import type { AWSError } from "aws-sdk";
import AWS, { S3 } from "aws-sdk";
import type { PutObjectOutput } from "aws-sdk/clients/s3";
// 对S3进行配置
export const createS3 = () => {
  AWS.config.update({
    region: "ap-northeast-1",
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "ap-northeast-1:d14de07d-7c6d-4d40-ad30-774a04dbeab7",
    }),
  });
  return new S3({
    apiVersion: "2006-03-01",
  });
};

export default async function Upload(bucket, key, uri, onSuccess, onProgress) {
  const s3 = createS3(); //传入您的S3令牌
  const response = await fetch(uri);
  const blob = await response.blob();

  s3.putObject(
    {
      Body: blob, // 是文件类型
      Bucket: bucket, // 对应S3上的bucket
      Key: key, // 需要上传到的路径
      GrantReadACP: "uri=http://acs.amazonaws.com/groups/global/AllUsers",
      GrantRead: "uri=http://acs.amazonaws.com/groups/global/AllUsers",
    },
    (err: AWSError, resp: PutObjectOutput) => {
      if (err) {
        console.log(err);
      } else {
        onSuccess(resp);
        console.log(JSON.stringify(resp)); // 上传成功时调用
      }
    })
    .onAsync("httpUploadProgress", (progress) => {
      console.log("progress:" + JSON.stringify(progress));
    })
    .on("httpUploadProgress", (progress) => {
      const percent = (100 * progress.loaded) / progress.total;
      onProgress(percent);
      console.log("percent:" + percent);
    })
    .on("httpError", (err) => {
      if (err) {
        console.log(err);
      }
    });
};

