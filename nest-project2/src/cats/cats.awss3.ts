import { HttpException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

// express랑 동일하다 그냥 타입만 정의해주면 될듯
export class CatAwsService {
  private readonly awsS3: AWS.S3;
  public readonly S3_Bucket_Name: string;
  constructor() {
    this.awsS3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY,
      region: process.env.AWS_S3_REGION,
    });
    this.S3_Bucket_Name = process.env.AWS_S3_BUCKET_NAME;
  }

  async uploadFileToS3(
    folder: string,
    files: Express.Multer.File[],
  ): Promise<
    {
      key: string;
      s3Object: PromiseResult<AWS.S3.PutObjectAclOutput, AWS.AWSError>;
      contentType: string;
    }[]
  > {
    try {
      const imgInfo: {
        key: string;
        s3Object: PromiseResult<AWS.S3.PutObjectAclOutput, AWS.AWSError>;
        contentType: string;
      }[] = [];
      for (let i = 0; i < files.length; i++) {
        const key = `${folder}/${Date.now()}_${files[i].originalname}`;
        const s3Object = await this.awsS3
          .putObject({
            Bucket: this.S3_Bucket_Name,
            Key: key,
            Body: files[i].buffer,
            ACL: 'public-read',
            ContentType: files[i].mimetype,
          })
          .promise();
        imgInfo.push({ key, s3Object, contentType: files[i].mimetype });
      }
      return imgInfo;
    } catch (error) {
      throw new HttpException('파일 업로드 오류', error);
    }
  }
}
