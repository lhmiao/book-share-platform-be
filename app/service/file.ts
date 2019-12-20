import { Service } from 'egg';

export default class FileService extends Service {
  async upload(fileName: string, filePath: string, fileSrcPrefix: string): Promise<string> {
    const fileSrc = `${fileSrcPrefix}/${fileName}`;
    await this.ctx.helper.fsRename(filePath, fileSrc);
    return fileSrc;
  }

  uploadUserAvatar(fileName: string, filePath: string): Promise<string> {
    return this.upload(fileName, filePath, this.ctx.constant.USER_AVATAR_FILE_PATH);
  }

  uploadBookPreview(fileName: string, filePath: string): Promise<string> {
    return this.upload(fileName, filePath, this.ctx.constant.BOOK_PREVIEW_FILE_PATH);
  }
}
