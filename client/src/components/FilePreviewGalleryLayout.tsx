import React, { useContext, useEffect } from 'react';
import { FileDesc } from '../models/file';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Image, DotGroup, CarouselContext } from 'pure-react-carousel';
import { apiServer } from '../config';

interface Props {
  files: FileDesc[];
  currSelected: number;
  setCurrSelected: (selected: number) => void;
  onOpen?: (index: number, file: FileDesc) => void 
}

function Carousel({files, onOpen, currSelected, setCurrSelected}: Props) {

  const carouselContext = useContext(CarouselContext);

  useEffect(() => {
    function onChange() {
      setCurrSelected(carouselContext.state.currentSlide);
    }
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext]);

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
                setCurrSelected(i)
              }}
            >
              <Image
                key={i}
                className="image"
                hasMasterSpinner={false}
                src={`${apiServer}/file/${file.path}`}
                alt={file.name}
              />
            </Slide>
          )
        }
      </Slider>
      <div className="control-group">
        <ButtonBack className="btn-back">&#x3C;</ButtonBack>
        <DotGroup dotNumbers={false}/>
        <ButtonNext className="btn-next">&#x3E;</ButtonNext>
      </div>
    </>
  )
}

function FilePreviewGalleryLayout(props : Props) {
  return (
    <CarouselProvider
      naturalSlideWidth={100}
      naturalSlideHeight={100}
      totalSlides={props.files.length}
      infinite={true}
      currentSlide={props.currSelected}
    >
      <Carousel {...props} />
    </CarouselProvider>
  )
}

export default FilePreviewGalleryLayout;
