let roleList = []; // глобальная переменная для хранения массива ролей
$(document).ready(function () {
    loadAuthenticadedUser();
});

function loadAuthenticadedUser() {
    const url = 'http://localhost:8080/rest/admin/authUser';
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then(data => {
            const roles = data.authorities;
            let roleStr = "";
            for (let role of roles) {
                roleStr += role.name.replace("ROLE_", "") + " ";
            }
            let user = `<label class="fw-bold">${data.email}</label>
                <label>with role:</label>
                <label/>${roleStr}</label>`;

            $('#AdminAuth').html(user);
        })
}
//вызов метода получения всех юзеров и заполнения таблицы
getAllUsers();

function getAllUsers() {
    $.getJSON("http://localhost:8080/rest/admin/allUsers", function (data) {
        console.log('1) данные с бэка /allUsers: ', JSON.stringify(data))
        let rows = '';
        $.each(data, function (key, user) {
            rows += createRows(user);
        });
        $('#tableAllUsers').append(rows);
        // получение ролей по url из json, добовляем в массив ролей
        $.ajax({
            url: '/rest/admin/authorities',
            method: 'GET',
            dataType: 'json',
            success: function (roles) {
                roleList = roles;
            }
        });
    });
}

//метод создания строк для таблицы
function createRows(user) {

    let user_data = '<tr id=' + user.id + '>';
    user_data += '<td>' + user.id + '</td>';
    user_data += '<td>' + user.name + '</td>';
    user_data += '<td>' + user.lastName + '</td>';
    user_data += '<td>' + user.age + '</td>';
    user_data += '<td>' + user.email + '</td>';
    user_data += '<td>';
    let roles = user.authorities;
    for (let role of roles) {
        user_data += role.name.replace('ROLE_', '') + ' ';
    }
    user_data += '</td>' +
        '<td>' + '<input id="btnEdit" value="Edit" type="button" ' +
        'class="btn-info btn edit-btn" data-toggle="modal" data-target="#editModal" ' +
        'data-id="' + user.id + '">' + '</td>' +

        '<td>' + '<input id="btnDelete" value="Delete" type="button" class="btn btn-danger del-btn" ' +
        'data-toggle="modal" data-target="#deleteModal" data-id=" ' + user.id + ' ">' + '</td>';
    user_data += '</tr>';

    return user_data;
}

// получаем все роли для изменения юзера (модалка)
function getUserRolesForEdit() {
    var allRoles = [];
    $.each($("select[name='editRoles'] option:selected"), function () {
        var role = {};
        role.id = $(this).attr('id');
        role.name = $(this).attr('name');
        allRoles.push(role);
        console.log("role: " + JSON.stringify(role));
    });
    return allRoles;
}

//Edit user
//при нажатие на кнопку Edit открвается заполненное модальное окно
$(document).on('click', '.edit-btn', function () {
    const user_id = $(this).attr('data-id');
    console.log("editUserId: " + JSON.stringify(user_id));
    $.ajax({
        url: '/rest/admin/' + user_id,
        method: 'GET',
        dataType: 'json',
        success: function (user) {
            $('#editId').val(user.id);
            $('#editName').val(user.name);
            $('#editLastName').val(user.lastName);
            $('#editPassword').val(user.password);
            $('#editAge').val(user.age);
            $('#editEmail').val(user.email);
            $('#editRole').empty();
            //для получения ролей в мадольном окне проходимся по массиву ролей, выделяем текущею роль у юзера
            roleList.map(role => {
                let flag = user.authorities.find(item => item.id === role.id) ? 'selected' : ''; //flag - для отметки текущей роль юзера, selected - выбрано
                $('#editRole').append('<option id="' + role.id + '" ' + flag + ' name="' + role.name + '" >' +
                    role.name.replace('ROLE_', '') + '</option>')
            })
        }
    });
});

//Отправка изменений модального окна
$('#editButton').on('click', (e) => {
    e.preventDefault();

    let userEditId = $('#editId').val();

    var editUser = {
        id: $("input[name='id']").val(),
        name: $("input[name='username']").val(),
        lastName: $("input[name='lastName']").val(),
        age: $("input[name='age']").val(),
        email: $("input[name='email']").val(),
        password: $("input[name='password']").val(),
        roles: getUserRolesForEdit()

    }
    $.ajax({
        url: '/rest/admin',
        method: 'PUT',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(editUser),
        success: (data) => { // data - ответ с кнтроллера на бэкэнде
            let newRow = createRows(data); // создаем новую строку
            console.log("newRow: " + newRow)
            $('#tableAllUsers').find('#' + userEditId).replaceWith(newRow); // в таблице по ID находим строку, которую изменяем и заменяем ее на новую
            $('#editModal').modal('hide');
            $('#admin-tab').tab('show');
        },
        error: () => {
            console.log("error editUser")
        }
    });
});

//Delete user
//при нажатие на кнопку Delete открвается заполненное модальное окно
$(document).on('click', '.del-btn', function () {

    let user_id = $(this).attr('data-id'); // получаю айди юзера у которого нажата кнопка delete
    console.log("userId: " + JSON.stringify(user_id));

    $.ajax({
        url: '/rest/admin/' + user_id,
        method: 'GET',
        dataType: 'json',
        success: function (user) {
            $('#delId').empty().val(user.id);
            $('#delName').empty().val(user.name);
            $('#delLastName').empty().val(user.lastName);
            $('#delAge').empty().val(user.age);
            $('#delEmail').empty().val(user.email);
            $('#delPassword').empty().val(user.password);
            $('#delRole').empty();
            //для получения ролей в мадольном окне проходимся по массиву ролей, выделяем текущею роль у юзера
            roleList.map(role => {
                let flag = user.authorities.find(item => item.id === role.id) ? 'selected' : ''; //flag - для отметки текущей роль юзера, selected - выбрано
                $('#delRole').append('<option id="' + role.id + '" ' + flag + ' name="' + role.name + '" >' +
                    role.name.replace('ROLE_', '') + '</option>')
            })
        }
    });
});

//удаляет юзера при нажатие на кнопку delete в модальном окне
$('#deleteButton').on('click', (e) => {
    e.preventDefault();
    let userId = $('#delId').val();
    $.ajax({
        url: '/rest/admin/' + userId,
        method: 'DELETE',
        success: function () {
            $('#' + userId).remove(); // удаляет юзера по айди
            $('#deleteModal').modal('hide'); // hide - скрывает модальное окно
            $('#admin-tab').tab('show'); // показать таблицу
        },
        error: () => {
            console.log("error delete user")
        }
    });
});

// получаем все роли для добавления юзера (вкладка добавить)
function getUserRolesForAdd() {
    var allRoles = [];
    $.each($("select[name='addRoles'] option:selected"), function () {
        var role = {};
        role.id = $(this).attr('id');
        role.name = $(this).attr('name');
        allRoles.push(role);
        console.log("role: " + JSON.stringify(role));
    });
    return allRoles;
}

//Add New User
//при нажатие на владку new user открывается вкладка для добавления юзера
$('.newUser').on('click', () => {

    $('#name').empty().val('')
    $('#lastName').empty().val('')
    $('#age').empty().val('')
    $('#email').empty().val('')
    $('#password').empty().val('')
    $('#addRole').empty().val('')
    roleList.map(role => {
        $('#addRole').append('<option id="' + role.id + '" name="' + role.name + '">' +
            role.name.replace('ROLE_', '') + '</option>')
    })
})

//отправляет заполненную форму с новым юзером, юзер добавляется
$("#addNewUserButton").on('click', () => {

    let newUser = {
        name: $('#name').val(),
        lastName: $('#lastName').val(),
        age: $('#age').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        roles: getUserRolesForAdd()
    }

    $.ajax({
        url: 'http://localhost:8080/rest/admin',
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(newUser),
        contentType: 'application/json; charset=utf-8',
        success: function () {
            $('#tableAllUsers').empty();
            getAllUsers();
            $('#admin-tab').tab('show');
        },
        error: function () {
            alert('error addUser')
        }
    });
});