function highlight(xPos, yPos, xSize, ySize, color) {
    var pdf = document.getElementById("the-canvas")
    if (pdf) {
        var page = pdf;
        var can;

        if (!document.getElementById('highlightCanvas')) {
            can = document.createElement('canvas');
            can.id = 'highlightCanvas';
            can.height = page.height;
            can.width = page.width;
            can.setAttribute('style', 'position: absolute;top: 0px;left: 0px;');
            var parent = pdf.parentElement;
            parent.appendChild(can)
        } else {
            can = document.getElementById('highlightCanvas')
        }
        var pagecanvas = can.getContext('2d');
        pagecanvas.clearRect(0, 0, can.width, can.height);

        if (page) {
            pagecanvas.beginPath();
            pagecanvas.rect(xPos, yPos, xSize, ySize);
            let highlightcolor = (!color ? 'rgba(66,216,66,0.5)' : color);
            pagecanvas.fillStyle = highlightcolor;
            pagecanvas.fill();
        }
    }
}