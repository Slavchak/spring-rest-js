$(document).ready(function () {
    loadAuthenticadedUser();
    loadUserTable();
});

function loadAuthenticadedUser() {
    const url = 'http://localhost:8080/rest/user/';
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

            $('#UserAuth').html(user);
        })
}

function loadUserTable () {
    const url = 'http://localhost:8080/rest/user';
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then(user => {
            let table = '';
            const roles = user.authorities;
            let roleStr = " ";
            for (let role of roles) {
                roleStr += role.name.replace("ROLE_", "") + " ";
            }
            let str = `<tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${roleStr}</td>                                   
                </tr>`;
            table += str;
            $('#tableUser').html(table);
        })
}