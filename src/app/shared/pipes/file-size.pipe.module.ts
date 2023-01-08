import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {
  /**
   * Returns the file size in a human readable format
   * @param _size The size in bytes
   * @returns the readable file size
   */

  transform(_size: number): string {
    let size: number = _size;
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const unit: string =
      units.find(() => {
        if (size / 1024 >= 1) {
          size = size / 1024;
          return false;
        }
        return true;
      }) ?? '';

    const roundedSize = Math.round(parseFloat(size.toFixed(2)) * 10) / 10;

    return `${roundedSize} ${unit}`;
  }
}

@NgModule({
  declarations: [FileSizePipe],
  exports: [FileSizePipe],
  providers: [FileSizePipe],
})
export class FileSizePipeModule {}
