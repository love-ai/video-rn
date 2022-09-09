import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { Upload } from "@aws-sdk/lib-storage";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// 对S3进行配置
const REGION = "ap-northeast-1";
const s3Client = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: "ap-northeast-1:d14de07d-7c6d-4d40-ad30-774a04dbeab7",
  }),
});

export default async function UploadFile(bucket, key, uri, onProgress, onSuccess) {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    console.log("blob:" + blob);

    s3Client.send(new PutObjectCommand({
      bucket:bucket,
      key:key,
      Body: blob,
      GrantReadACP: "uri=http://acs.amazonaws.com/groups/global/AllUsers",
      GrantRead: "uri=http://acs.amazonaws.com/groups/global/AllUsers",
    }));

    // const _upload = new Upload({
    //   client: s3Client,
    //   params: {
    //     Bucket: bucket,
    //     Key: key,
    //     Body: blob,
    //     GrantReadACP: "uri=http://acs.amazonaws.com/groups/global/AllUsers",
    //     GrantRead: "uri=http://acs.amazonaws.com/groups/global/AllUsers",
    //   },
    // });
    // _upload.on("httpUploadProgress", (progress) => {
    //   const percent = (100 * progress.loaded) / progress.total;
    //   console.log("percent:" + percent);
    //   onProgress(percent);
    // });
    // let res = await _upload.done();
    // onSuccess(res);
    // return res;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

