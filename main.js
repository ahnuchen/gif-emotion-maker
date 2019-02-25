/**
 * gif表情制作
 * 作者：陈长裕
 * 日期 2019-02-25
 */
var gif = new GIF({
    workers: navigator.hardwareConcurrency || 2,
    quality: 10,
    background: '#fff'
});
var $fontSize = $('#fontSize');
var $frameImages = $('#frameImages');
var $uploadImageFile = $('#uploadImageFile');
var $uploadImage = null;
var $imgs = null;
var $gifImage = $('#gifImage');
var $tip = $('#tip');
var $wait = $('#wait');
var $firstText = $('#firstText');
var $secondText = $('#secondText');
var imgW = 0;
var imgH = 0;
var TextRenderOption = 1;
$uploadImageFile.change(function (e) {
    $('.jsgif').remove();
    $uploadImage = $('<img id="uploadImage" rel:auto_play="0" />');
    $uploadImageFile.after($uploadImage);
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function () {
        $uploadImage.attr('src', reader.result);
        $uploadImage.show();
        $uploadImage.attr('rel:animated_src', $uploadImage.attr('src'));
        gifChange()
    };
    reader.readAsDataURL(file);
});

$('#uploadImageFileBtn').click(function () {
    $uploadImageFile.trigger('click')
});

function gifChange() {
    var rub = new SuperGif({gif: $uploadImage[0]});
    rub.load(function () {
        var frameLength = rub.get_length();
        for (var i = 0; i < frameLength; i++) {
            rub.move_to(i);
            var can = rub.get_canvas().toDataURL();
            var $img = $('<div class="frameItem hide">' +
                '<img class="imgItem" src="' + can + '" />' +
                '<br>' +
                '<input class="itemText1" type="text" />' +
                '<br>' +
                '<input class="itemText2" type="text" />' +
                '</div>');
            $frameImages.append($img)
        }
        rub.play();
        $('#TextRenderOption').show();
        $('#renderGif').show()
    });
}

$('[name="TextRenderOption"]').change(function (e) {
    TextRenderOption = $(this).val();
    if (TextRenderOption == 1) {
        $('#lineText').show();
        $('.frameItem').hide()
    } else {
        $('#lineText').hide();
        $('.frameItem').css({
            display: "inline-block"
        })
    }
});

function render() {
    if (gif.running) return alert('请不要点击太快');
    var gifCanvas = $('.jsgif canvas');
    imgW = gifCanvas.attr('width') * 1;
    imgH = gifCanvas.attr('height') * 1;
    $('#addTextCanvas').attr({
        width: imgW,
        height: imgH
    });
    gif.setOptions({
        width: imgW,
        height: imgH
    });
    $wait.show();
    $imgs = $('.imgItem');
    $imgs.each(function (index) {
        gif.addFrame(drawText(index), {delay: 120, copy: true});
    });
    gif.render();
}

function getRadio(number) {
    return $('#radio' + number).val() / 100
}

function drawText(index) {
    var textCanvas = $('#addTextCanvas')[0];
    var ctx = textCanvas.getContext('2d');
    ctx.clearRect(0, 0, imgW, imgH);
    ctx.drawImage($imgs[index], 0, 0);
    ctx.font = $fontSize.val() + "px Arial";
    ctx.fillStyle = $('#fontColor').val();
    if (TextRenderOption == 1) {
        ctx.fillText($firstText.val(), imgW * getRadio(1), imgH * getRadio(2));
        ctx.fillText($secondText.val(), imgW * getRadio(3), imgH * getRadio(4));
    } else {
        ctx.fillText($('.itemText1').eq(index).val(), imgW * getRadio(1), imgH * getRadio(2));
        ctx.fillText($('.itemText2').eq(index).val(), imgW * getRadio(3), imgH * getRadio(4));
    }
    return ctx
}

gif.on('finished', function (blob) {
    var imageUrl = URL.createObjectURL(blob);
    $gifImage.attr('src', imageUrl);
    $gifImage.show();
    $tip.show();
    $wait.hide();
    gif.frames = [];
    gif.freeWorkers = [];
    gif.imageParts = [];
    gif.abort()
});
