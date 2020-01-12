class ImageLoader {
    constructor() {
        var loadedImage = [];
        this.getImage = function (image, onLoadFinish) {
            if (loadedImage[image]) {
                if (onLoadFinish) {
                    onLoadFinish();
                }
                return loadedImage[image];
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
                return newImage;
            }
        };
    }
}
