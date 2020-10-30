import React from 'react';
import { FileDesc } from '../models/file';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Image, DotGroup, WithStore } from 'pure-react-carousel';
import { apiServer } from '../config';
import Icon from './Icon';
import { AppControl } from '../App';

class Gallery extends React.PureComponent<{
  files: FileDesc[];
  control: AppControl;
  carouselStore: any;
}> {
  
  render() {
    const {control, files, carouselStore} = this.props;
    control.setCurrIndex(carouselStore.getStoreState().currentSlide);
    return (
      <>
        <Slider classNameAnimation={"slide-animation"}>
          {
            files.map((file, i) =>
              <Slide
                key={i}
                index={i}
                style={{ paddingBottom: 'calc(90vh - 25px)' }}
                onFocus={() => {
                  console.log('onFocus', i)
                  control.setCurrIndex(i)
                }}
              >
                <div className="image-box">
                  <ButtonBack className="btn btn-back">
                    <Icon name="chevron-left"/>
                  </ButtonBack>
                  <div className="image-frame">
                    <Image
                        key={i}
                        className="image"
                        hasMasterSpinner={false}
                        src={`${apiServer}/file/${file.path}`}
                        alt={file.name}
                    />
                    <div className="image-frame-overlay-left" onClick={control.selectPrev} />
                    <div className="image-frame-overlay-right" onClick={control.selectNext} />
                  </div>
                  <ButtonNext className="btn btn-next">
                    <Icon name="chevron-right"/>
                  </ButtonNext>
                </div>
              </Slide>
            )
          }
        </Slider>
        <div className="control-group">
          <DotGroup dotNumbers={false}/>
        </div>
      </>
    );
  }
}

const GalleryWithStore = WithStore(Gallery);

export default class FilePreviewGalleryLayout extends React.PureComponent<{
  files: FileDesc[];
  currIndex: number;
  control: AppControl;
}> {
  render() {
    const {files, currIndex, control} = this.props;
    return (
      <CarouselProvider
         naturalSlideWidth={100}
         naturalSlideHeight={100}
         totalSlides={this.props.files.length}
         infinite={true}
         currentSlide={this.props.currIndex}
       >
         <GalleryWithStore
          files={files}
          control={control}
         />
       </CarouselProvider>
    );
  }
}

