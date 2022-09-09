import AWS, { S3 } from "aws-sdk";
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

export default async function Upload(bucket, key, uri, onSuccess, onError) {
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
    (err, resp) => {
      if (err) {
        onError("上传失败");
      } else {
        console.log("success:" + JSON.stringify(resp));
        onSuccess(resp);
      }
    })
    .on("httpUploadProgress", (progress) => {
      const percent = (100 * progress.loaded) / progress.total;
      console.log("percent:" + percent);
    })
    .on("httpError", (err) => {
      onError("上传失败");
      if (err) {
        console.log(err);
      }
    });
};

