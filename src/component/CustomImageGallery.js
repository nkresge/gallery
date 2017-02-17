import React, { PropTypes } from 'react';
import ImageGallery from 'react-image-gallery';

class CustomImageGallery extends React.Component {

    static propTypes = {
        images: PropTypes.array.isRequired,
        onImageLoad: PropTypes.func,
    }

    getCurrentIndex() {
        return this.gallery.getCurrentIndex();
    }

    render() {
        return (
            <ImageGallery
                ref={x => this.gallery = x}
                infinite={false}
                items={this.props.images}
                thumbnailPosition={'left'}
                onSlide={this.props.onImageLoad}
            />
        );
    }

}

export default CustomImageGallery;
