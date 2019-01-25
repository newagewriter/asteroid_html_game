class ImageLoader {
    constructor() {
        /**
         * @type Image[]
         */
        var loadedImage = [];
        this.getImage = function (image, onLoadFinish) {
            if (loadedImage[image]) {
                if (onLoadFinish) {
                    onLoadFinish();
                }
                return loadedImage[image].cloneNode(true);
            }
            else {
                var newImage = new Image();
                newImage.src = image;
                loadedImage[image] = newImage;
                newImage.onload = function () {
                    if (onLoadFinish) {
                        onLoadFinish();
                    }
                };
                return newImage.cloneNode(true);
            }
        };
    }
}
