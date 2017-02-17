import React, { Component } from 'react';
import _ from 'lodash';

import CustomImageGallery from './component/CustomImageGallery';

import './App.css';

class App extends Component {

    // If we get within LOAD_AT of the end, then load more.
    static LOAD_AT = 3

    // Unsplash url base
    static URL = 'https://api.unsplash.com/photos?'

    // Client id
    static CLIENT_ID = '9330d5f432c82752b06409498f15b4b268c11e97ce5e7c6d58ee3744ccffc038';

    state = {
        images: [],
        page: 0,
        fullyLoaded: false,
    }

    constructor(props) {
        super(props);
        this.loadMoreImages = this.loadMoreImages.bind(this);
        this.storeImages = this.storeImages.bind(this);
    }

    componentWillMount() {
        this.fetchImages(0, this.storeImages);
    }

    componentWillUnmount() {
        // Cancel pending calls.
    }

    storeImages(images) {
        // Uniq on keys.
        this.setState({
            page: this.state.page + 1,
            images: this.state.images.concat(images)
        });
    }

    loadMoreImages() {
        // Don't load more if we have fully loaded.
        if(this.state.fullyLoaded) {
            return;
        }

        const index = this.gallery.getCurrentIndex();
        if(index + App.LOAD_AT > this.state.images.length) {
            console.log('more');
            this.fetchImages(this.state.page + 1, this.storeImages)
        }
    }

    fetchImages(page, callback) {
        const checkStatus = response => {
            if (response.status >= 200 && response.status < 300) {
                return response;
            }
            const error = new Error(`HTTP Error ${response.statusText}`);
            error.status = response.statusText;
            error.response = response;
            console.log(error);
            throw error;
        };

        const parseJSON = response => {
            return response.json();
        };

        const validateResponse = response => response;

        const extractImages = json => {
            return json.map(obj => {
                return {
                    original: obj.urls.regular,
                    thumbnail: obj.urls.thumb,
                };
            });
        }

        //return fetch(`/page${page+1}.json`, {
        return fetch(`${App.URL}page=${page+1}&client_id=${App.CLIENT_ID}`, {
            accept: 'application/json',
        })
        .then(checkStatus)
        .then(parseJSON)
        .then(validateResponse)
        .then(extractImages)
        .then(callback);
    }

    render() {
        const galleryOrPlaceholder = this.state.images.length ?
            <CustomImageGallery
                images={this.state.images}
                onImageLoad={this.loadMoreImages}
                ref={x => this.gallery = x}
            /> :
            <p>Loading...</p>;

        return (
            <div className="App">
                <div className="App-header">
                    <h2>Superhuman Photo Gallery</h2>
                </div>
                {galleryOrPlaceholder}
                <p className="App-intro" />
            </div>
        );
    }
}

export default App;
