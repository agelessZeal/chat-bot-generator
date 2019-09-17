$('.chat-avatar-item').click(function () {
    var avatarPath = $(this).data('path');
    if ( avatarPath!= "") {
        var avatarList = $('.chat-avatar-item');
        avatarList.each(function () {
            $(this).removeClass('active');
        });
        $(this).addClass('active');
        $('.chat-box-avatar-header img').attr('src',avatarPath);
        $('.chat-box-avatar img').attr('src',avatarPath);

        $('#avatar_path').val(avatarPath);
        $('#chatbot-icon img').attr('src',avatarPath);
        makeChatBotIcon();

        console.log(avatarPath);
    }else{
        console.log('clicking custom avatar..........');
    }
});
$('.chat-color-item-p').click(function () {
    if ($(this).data('color') != "") {
        var primaryColorList = $('.chat-color-item-p');
        primaryColorList.each(function () {
            $(this).removeClass('active');
        });
        $(this).addClass('active');
        $('#p_color').val($(this).data('color'));
        $('.chat-box-header').css({'background-color':$(this).data('color')});
    } else {
        $('#custom-primary-color')[0].click();
    }
});
$('.chat-color-item-s').click(function () {
    if ($(this).data('color') != "") {
        var primaryColorList = $('.chat-color-item-s');
        primaryColorList.each(function () {
            $(this).removeClass('active');
        });
        $(this).addClass('active');
        $('#s_color').val($(this).data('color'));

        $('.chat-box-avatar-header').css({'background-color':$(this).data('color')});
        $('#chatbot-icon .avatar-wrap').css({'background-color':$(this).data('color')});
        makeChatBotIcon();

    } else {
        $('#custom-secondary-color')[0].click();
    }
});

$('#custom-secondary-color').change(function () {
    $('#s_color').val($(this).val());
    $('.custom-secondary').css({'background-color': $(this).val()});

    $('.chat-box-avatar').css({'background-color':$(this).val()});
    $('.chat-box-avatar-header').css({'background-color':$(this).val()});

    $('#chatbot-icon .avatar-wrap').css({'background-color':$(this).val()});
    makeChatBotIcon();

});
$('#custom-primary-color').change(function () {
    $('#p_color').val($(this).val());
    $('.custom-primary').css({'background-color': $(this).val()});
    $('.chat-box-header').css({'background-color':$(this).val()});
});

$('#bot_name').keyup(function () {
    $('.chat-box-preview-name').text($(this).val());
});

$('#with_us').keyup(function () {
    $('#chatbot-icon .chat-with-us').text($(this).val());
    makeChatBotIcon();
});

$('.chat-opening-day-item').click(function () {
   $(this).toggleClass('active');
   var curDay = $(this).text();
    var openDayChk = $('#'+curDay + '-openday');
    openDayChk.prop("checked", !openDayChk.prop("checked"));
});

$('.chat-customer-accept-item').click(function () {
    $(this).toggleClass('active');
    var curAcceptItem = $(this).text();
    var customerAcceptChk = $('#'+curAcceptItem + '-customer-accept');
    customerAcceptChk.prop("checked", !customerAcceptChk.prop("checked"));
});


function makeChatBotIcon() {
    var element = $("#chatbot-icon"); // global variable
    var getCanvas; // global variable

    $("#icon-previewImage").html('');
    html2canvas(element, {
        onrendered: function (canvas) {
            $("#icon-previewImage").append(canvas);
            getCanvas = canvas;
            var imageData = getCanvas.toDataURL("image/png");

            // Now browser starts downloading it instead of just showing it
            //var newData = imageData.replace(/^data:image\/png/, "data:application/octet-stream");
            //$("#btn-Convert-Html2Image").attr("download", "your_pic_name.png").attr("href", newData);

            $.ajax({
                type:'post',
                url:'/upload/icon',
                data:{icon_path: imageData},
                success:function (res) {
                    if(res.status == 'success'){
                        $('#icon_path').val(res.data);
                        console.log($('#icon_path').val(res.data));
                    }else{
                        console.log(res.data);
                    }

                },
                error:function (res) {
                    console.log("can't make chatbot icon!");
                    console.log(res);
                }
            })

        }
    });

}

$(document).ready(function () {
    if($('#icon_path').val() == ""){
        makeChatBotIcon();
    }
});
