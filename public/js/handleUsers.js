$(document).ready(function () {
    $('.form_register').show()
    $('.messaging').hide();
})
var socket = io('http://localhost:3000');
var userName = null;

$(document).ready(function () {

    //create user name
    $('#submit').click(function () {
        let data = $('#inputUsername').val()
        socket.emit('createUserName', data);
        userName = data;
    })

    //create Group
    $('#createGroup').click(function () {
        let data = $('#nameGroup').val()
        socket.emit('createGroup', data);
        $('#nameGroup').val("")
    })

    //send message
    $('#sendbtn').click(function () {
        let mess = $('#message').val()
        socket.emit('mess', mess);
        $('#message').val("");
        $('.msg_history').append('<div class="outgoing_msg"> '
            + '<div class="sent_msg">'
            + '<p>Me: ' + mess + '</p>'
            + '<span class="time_date"> 11:01 AM | June 9</span>'
            + '</div>'
            + '</div>');

    })

    socket.on('failed', function () {
        alert('Username Da Ton')
    })

    // socket.on('listGroup', function (data) {
    //     console.log(data);
    // })

    socket.on('createdUserName', function (data) {
        $('.form_register').hide(200)
        $('.messaging').show(1000);
        $('.UsserName').html(data);
    })


    socket.on('listUser', function (data) {
        $('.inbox_chat').html("");

        let index = data.indexOf(userName);
        if (index > -1) {
            data.splice(index, 1);
        }

        data.forEach(function (data, i) {

            $('.inbox_chat').append(
                '<div class="chat_list">' +
                '<div class="chat_people">' +
                '<div class="chat_img">' +
                '<img src="https://sanjaymotels.com/wp-content/uploads/2019/01/testimony.png"' +
                'alt="sunil">' +
                '</div>' +
                '<div class="chat_ib">' +
                ' <h5>' + data + ' </h5> ' +
                '</div>' +
                '</div>' +
                '</div>');
            if (i == 0) {
                $('.chat_list').addClass('active_chat');
            }
        });

    })

    socket.on('msg_in', function (data) {
        console.log(data.fromUser);
        $('.msg_history').append(
            '<div class="received_msg">'
            + '<div class="received_withd_msg">'
            + '    <p>' + data.fromUser + ': ' + data.mess + '</p>'
            + '    <span class="time_date"> 11:01 AM | June 9</span>'
            + '</div>'
            + '</div>'
        )
    })
})
