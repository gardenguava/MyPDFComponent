function loadPage(url, pageNumber, scale) {
    var pdfjsLib = window['pdfjs-dist/build/pdf'];

    pdfjsLib.GlobalWorkerOptions.workerSrc = './assets/pdf.worker.js';
    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(function(pdf) {
      pdf.getPage(pageNumber).then(function(page) {
        var viewport = page.getViewport({scale: scale});
        var canvas = document.getElementById('the-canvas');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.promise.then(function () {
        });
      });
    }, function (reason) {
      console.error(reason);
    });
}

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
            pagecanvas.globalAlpha = 0.4;
            let highlightcolor = (!color ? 'rgba(66,216,66,0.5)' : color);
            pagecanvas.fillStyle = highlightcolor;
            pagecanvas.fill();
        }
    }
}