class ColisionManager {
    /**
     * 
     * @param {Component} component1 
     * @param {Component} component2 
     * @returns {boolean}
     */
    hitTest(component1, component2) {
        return component1.shape.hitTest(component2.shape);
    }
}