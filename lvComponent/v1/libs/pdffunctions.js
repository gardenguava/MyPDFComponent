// [LV]: Define global variables here

// Appian callbacks
$(document).ready(function () {
    Appian.Component.onNewValue(function (newValues) {
        var url = newValues.docurl;
        var pageNumber = newValues.pageNumber;
        var scale = newValues.scale;
        var coordinates = newValues.coordinates;

        if(url && pageNumber && scale) {
            loadPage(url, Number(pageNumber), Number(scale), coordinates);
        }
    });
});

// [LV]: functions
function loadPage(url, pageNumber, scale, coordinates) {
    var pdfjsLib = window['pdfjs-dist/build/pdf'];

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'libs/pdf.worker.js';
    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(function(pdf) {
      pdf.getPage(pageNumber).then(function(page) {
        var viewport = page.getViewport({scale: scale});
        var canvas = document.getElementById('the-canvas');
        var context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = document.documentElement.clientWidth;

        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.promise.then(function () {
            highlightAll(coordinates);
        });
      });
    }, function (reason) {
    });
}

function highlightAll(coordinates) {
    if(coordinates && coordinates.length > 0) {
        var pdf = document.getElementById("the-canvas");
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
                for(var i=0; i<coordinates.length; i++) {
                    var xPos = coordinates[i].xPos;
                    var yPos = coordinates[i].yPos;
                    var xSize = coordinates[i].xSize;
                    var ySize = coordinates[i].ySize;
                    var color = coordinates[i].color;

                    pagecanvas.beginPath();
                    pagecanvas.rect(Number(xPos), Number(yPos), Number(xSize), Number(ySize));
                    pagecanvas.globalAlpha = 0.4;
                    let highlightcolor = (!color ? 'rgba(66,216,66,0.5)' : color);
                    pagecanvas.fillStyle = highlightcolor;
                    pagecanvas.fill();
                }
            }
        }
    }
}