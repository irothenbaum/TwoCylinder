/**
 * Color Transition is a helper class that will smoothly transition one color to another
 */
TwoCylinder.Utilities.ColorTransition = (function(){
    /**
     * colors should be either an array or an object keyd to where in the transition percentage it should shift
     * ie, {0:red, 25:blue, 75:orange} will start red, shift to blue by 25%, then to orange by 75%
     * NOTE: Must use same the number of digits for each or else 5 will preempt 1.25
     */
    var singleColorTransition = function(startColor, stopColor, duration) {
        this.getColorAtStep = function(step) {
            return this.getColorAtPercent(step / duration);
        };

        this.getColorAtPercent = function(percent) {
            //TODO: How do you mix 2 colors?
            return (stopColor * percent) + (startColor * (1-percent));
        }
    };

    return function(colors, duration) {
        this._colors = [];
        this._transitions = [];
        var that = this;

        // we convert the colors array into a usable form and save it is this._transition
        if (Array.isArray(colors)) {
            var length = colors.length;
            _.each(colors, function(c, index) {
                that._colors.push({
                    keypoint : parseFloat(index / length),
                    color : c
                });

            });
        } else {
            _.sortedIndex(colors);
            _.each(colors, function(c, index){
                that._colors.push({
                    keypoint : parseFloat(index),
                    color : c
                })
            });
        }

        // this creates the transitions array (converting all single colors and keypoints
        // into transition objects
        for (var i=1; i<this._colors.length; i++) {
            this._transitions.push(new singleColorTransition(
                this._colors[i-1].color,
                this._colors[i].color,
                (this._colors[i].keypoint*duration/100) - (this._colors[i-1].keypoint*duration/100)
            ));
        }

        this._step = 0;

        // this function iterates the step counter
        // TODO: This can be improved using some momoization to record current transitions
        // TODO: so we don't have to keep searching for it
        this.step = function(){
            return this.getColorAtStep(this._step++);
        };

        // this function will return a color at a given step
        this.getColorAtStep = function(step) {
            var i;
            // we find the color that is to start directly after the color at this step finishes
            // transitioning, we know this will be our stop point
            for(i=0; i < this._colors.length; i++) {
                if (this._colors[i].keypoint > step) {
                    // we decrement by 1 because we don't want the stoppoint transition, we want the one
                    // directly before it
                    i--;
                    break;
                }
            }

            // we get the transition
            var transition = this._transitions[i];

            // we determine when this transition started (to work back the relative step)
            var startPoint = this._colors[i].keypoint;

            // we return the color at this transitions relative step
            return transition.getColorAtStep(step - startPoint);
        }
    };
})();
