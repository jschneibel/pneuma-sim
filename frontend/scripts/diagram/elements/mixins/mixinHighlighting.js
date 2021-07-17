export default function mixinHighlighting({
    element = {},
    highlighted = false
}) {
    element.isHighlighted = function() {
        return highlighted;
    };

    element.highlight = function() {
        highlighted = true;
    };

    element.unhighlight = function() {
        highlighted = false;
    };
}