import React, { PureComponent } from 'react';
import * as service from '../../../services/fileService';
import { AppProps } from '../../../models/app';
import { ImageDesc } from '../../../models/file';
import RightPane from '../../RightPane';
import Label from '../../controls/Label';
import './index.scss';
import { sortColorByRGB } from '../../../utils/colorUtils';
import { loadImageData } from '../../../utils/domUtils';

export default class ImageEditor extends PureComponent<AppProps> {
  paletteCanvas: HTMLCanvasElement;

  async analyseColor() {
    const { currFile } = this.props;
    const file = currFile.file as ImageDesc;
    const src = service.file(file.path);
    const canvas = this.paletteCanvas;
    const context = canvas.getContext('2d');
    const imgData = await loadImageData(src);

    let colors = [];

    const data = imgData.data;
    console.log('pixel length:', data.length, imgData.width, imgData.height);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a === 0) {
        continue;
      }
      const color = (r << 16) | (g << 8) | b;
      colors.push(color);
    }
    // colors = uniq(colors);

    colors = colors.sort(sortColorByRGB);

    console.log('total', colors.length);

    const ndata = [];
    for (let h = 0; h < 200; h++) {
      const c = colors[Math.floor((h * colors.length) / 200)];
      const r = (c & 0xff0000) >> 16;
      const g = (c & 0x00ff00) >> 8;
      const b = c & 0x0000ff;
      for (let w = 0; w < 200; w++) {
        ndata.push(r);
        ndata.push(g);
        ndata.push(b);
        ndata.push(255);
      }
    }
    const newImgData = context.createImageData(200, 200);
    for (let i = 0, len = 200 * 200 * 4; i < len; i++) {
      newImgData.data[i] = ndata[i];
    }

    context.putImageData(newImgData, 0, 0);
  }

  render() {
    const { currFile } = this.props;
    const file = currFile.file as ImageDesc;
    const src = service.file(file.path);
    return (
      <div className="image-editor">
        <div className="main-area">
          <img
            id="curr-edit-img"
            className="image"
            src={src}
            style={{
              maxHeight: `calc(100vh - var(--topbar-height)`,
              maxWidth: '100%'
            }}
            alt={file.name}
          />
        </div>
        <RightPane {...this.props}>
          <Label text={file.name} />
          <Label text={`${file.width}x${file.height}`} />
          <canvas
            id="color-palette-canvas"
            width="200"
            height="200"
            style={{
              border: 'black 1px solid'
            }}
            ref={(ref) => (this.paletteCanvas = ref)}
          />
        </RightPane>
      </div>
    );
  }
}
