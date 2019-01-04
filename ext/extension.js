Array.prototype.containsInRange = function(value, range) {
    for (i = 0; i < this.length; ++i) {
        if (this[i] <= (y + range) && this[i] >= (y - range)) {
            return true;
        }
    }
    return false;
}