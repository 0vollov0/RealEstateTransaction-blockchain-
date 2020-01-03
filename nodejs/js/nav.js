var mb_id_session;

window.onload = () => {
    $('#nav').load('/template/nav.html', () => {

        // mb_id_session = '<%=mb_id%>';
        mb_id_session = document.getElementsByName('mb_id_session')[0].value;

        if (mb_id_session.length > 0 && mb_id_session !== null && mb_id_session !== "") {
            // document.getElementsByClassName('navbar-nav')[0].children[1].innerHTML = "<li class='nav-item'><a class='nav-link' href='/login'>거래내역</a></li>";
            document.getElementsByClassName('navbar-nav')[0].children[1].innerHTML = "<li class='nav-item'><a class='nav-link' href='/join'>개인정보</a></li>";
            document.getElementsByClassName('navbar-nav')[0].children[2].innerHTML = "<li class='nav-item'><a class='nav-link' href='/logout'>로그아웃</a></li>";
        } else {
            document.getElementsByClassName('navbar-nav')[0].children[1].innerHTML = "<li class='nav-item'><a class='nav-link' href='/login'>로그인</a></li>";
            document.getElementsByClassName('navbar-nav')[0].children[2].innerHTML = "<li class='nav-item'><a class='nav-link' href='/join'>회원가입</a></li>";
        }
    });

}