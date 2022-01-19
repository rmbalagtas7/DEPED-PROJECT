import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import {carouselImages} from '../utils/constants'
function CustomCarousel() {
    return (
        <Carousel
          dynamicHeight
          showThumbs={false}
          autoPlay
          infiniteLoop
          centerMode
        >
          {carouselImages.map((image, index) => (
            <div key={index}>
              <img src={image} alt="carousel_image" height="auto" />
            </div>
          ))}
        </Carousel>
    )
}

export default CustomCarousel
