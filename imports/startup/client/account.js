import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import {Session} from 'meteor/session';

if(Meteor.isClient){
    Template.registerHelper('check_session', function(){
        return Session.get('id');
    })
    Template.modifyMyInfo.helpers({
        get_id: Session.get('id'),
        get_name: Session.get('name'),
        get_email: Session.get('email'),
        get_gender: Session.get('gender'),
        get_birth: Session.get('birth'),
        get_tier: function () {
            if (Session.get('tier')=='free') return "무료"
            else return "유료"
        },
        check_gender: function(data){
            if(data==Session.get('gender')) return "checked"
        }
    })

  

    Template.register.events({
    'click .rg-btn': function(event) {
        event.preventDefault();
        if ($("#rg_user_pass").val() === $("#rg_user_pass_check").val()) {
            let userData = {
                id: $("#rg_user_id").val(),
                pw: $("#rg_user_pass").val(),
                name: $("#rg_user_name").val(),
                birth: $("#rg_user_birthDay").val(),
                gender: $("#rg_user_gender").val(),
                email: $("#rg_user_email").val(),
                tier: "free",
            }
            console.log(userData);
            $.ajax({
                url: 'http://localhost:3001/account/register',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(userData),
                success: function (data) {
                    if (data == "success") {
                        alert("회원가입이 완료되었습니다.")
                        FlowRouter.go('/');
                    } else if (data.code == 11000) {
                        alert("이미 등록된 아이디입니다.")
                    }
                }
            })
        } else {
            alert("비밀번호와 비밀번호 확인이 같지 않습니다.");
        }
    },
});

    Template.mainTopBar.events({
        'click .btn-logout': function (event) {
            event.preventDefault();
            Session.set({
                id: null,
                name: null,
                email: null,
                birth: null,
                gender: null,
                tier:null
            })
            FlowRouter.go("/")
        },
    });



Template.login.events({
    'click .login-btn': function (event) {
        event.preventDefault();
        let userData = {
            id: $(".user_name").val(),
            pw: $(".user_pass").val(),
        }
        console.log(userData);
        $.ajax({
            url: 'http://localhost:3001/account/login',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function (data) {
                console.log(data);
                if (data.code == "success") {
                    Session.set({
                        id:data.id,
                        name:data.name,
                        email:data.email,
                        birth:data.birth,
                        gender:data.gender,
                        tier:data.tier
                    })
                    FlowRouter.go('/');
                } else if (data.code == "not found") {
                    alert("아이디 혹은 비밀번호가 틀렸습니다.")
                }
            }
        })
    },
});

Template.findId.events({
    'click .find-id-btn': function (event) {
        let userData = {
            name: $("#user_name_1").val(),
            birth: $("#user_birthDay").val(),
        }
        console.log(userData);
        $.ajax({
            url: 'http://localhost:3001/account/findId',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function (data) {
                console.log(data);
                if (data.code == "success") {
                    alert(`등록된 사용자의 아이디는 ${data.id} 입니다.`)
                } else if (data.code == "not found") {
                    alert("등록된 사용자 정보가 없습니다.")
                }
            }
        })
    },
});

Template.findPw.events({
    'click .find-pass-btn': function (event) {
        let userData = {
            id: $("#find_user_id").val(),
            name: $("#find_user_name").val(),
            email: $("#find_user_email").val(),
        }
        console.log(userData);
        $.ajax({
            url: 'http://localhost:3001/account/findPw',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function (data) {
                console.log(data);
                if (data.code == "success") {
                    alert(`등록된 사용자의 비밀번호는 ${data.pw} 입니다.`)
                } else if (data.code == "not found") {
                    alert("등록된 사용자 정보가 없습니다.")
                }
            }
        })
    },
});

Template.index.events({
    'click .search-btn': function (event) {
        if ($(".search-url").val() == "") {
            alert("분석을 진행할 사이트의 주소를 입력해 주세요(ex. https://www.google.com")
            return
        }
        if(Session.get('id')!==null){
            let userData = {
                userId: Session.get('id'),
                url: $(".search-url").val(),
            }
            console.log(userData);
            $.ajax({
                url: 'http://localhost:3001/analysis',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(userData),
                success: function (data) {
                    alert("웹페이지 분석이 시작되었습니다. 나의 분석 결과 페이지로 이동하여 결과를 확인하세요")
                }
            })
        }
        else{
            alert("로그인 후 이용해 주세요.")
            FlowRouter.go("/login")
        }
    },
});

Template.analysisDetail.rendered = function(){
    let userData = {
        _id: FlowRouter.current().params.dataId
    }
    console.log(userData)
    $(".analysis-container").html(`<iframe src="http://localhost:3001/analysis/getAnalysis/${userData._id}" frameborder="0" width="100%" height="2500px"></iframe>`)
}

Template.myInfo.events({
    'click .c-p-btn': function (event) {
        let userData = {
            id: Session.get('id'),
            pw: $(".c-p-input").val(),
        }
        console.log(userData);
        $.ajax({
            url: 'http://localhost:3001/account/checkPw',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function (data) {
                console.log(data);
                if (data == Session.get('id')) {
                    FlowRouter.go("/modifyMyInfo");
                } else if (data == "not found") {
                    alert("비밀번호가 틀렸습니다.")
                }
            }
        })
    },
});

Template.myAnalysis.events({
    'click .delete-analysis': function(e){
        let userData = {
            _id: $(e.target).attr("id"),
        }
        console.log(userData);
        $.ajax({
            url: 'http://localhost:3001/analysis/deleteAnalysisList',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function (data) {
                alert("선택 항목을 삭제하였습니다.")
                $(".analysis-items").html("")
                let userData = {
                    userId: Session.get('id'),
                }
                $.ajax({
                    url: 'http://localhost:3001/analysis/getAnalysisList',
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify(userData),
                    success: function (data) {
                        data.forEach(element => {
                            let item = `
                            <tr class="analysis-item" id="${element._id}">
                                <td>${element.title}</td>
                                <td>${element.date.substring(0,10)}</td>
                                <td><button alt=""  id="${element._id}" class="download-csv-analysis"></button></td>
                                <td><button alt=""  id="${element._id}" class="download-pdf-analysis"></button></td>
                                <td><button alt=""  id="${element._id}" class="download-json-analysis"></button></td>
                                <td><button alt=""  id="${element._id}" class="view-analysis"></button></td>
                                <td><button alt=""  id="${element._id}" class="delete-analysis"></button></td>
                            </tr>
                            `
                            $(".analysis-items").append(item)
                        });
                    }
                })
            }   
        })
    },

    'click .view-analysis': function (e) {
        let userData = {
            _id: $(e.target).attr("id"),
        }
        FlowRouter.go("/analysisDetail/"+userData._id)
    },

    'click .download-csv-analysis': function (e) {
        let userData = {
            dir: $(e.target).attr("dir"),
            type:"csv"
        }
        window.open(`http://localhost:3001/analysis/getFile/${userData.dir}/${userData.type}`)
    },

    'click .download-json-analysis': function (e) {
        let userData = {
            dir: $(e.target).attr("dir"),
            type: "json"
        }
        window.open(`http://localhost:3001/analysis/getFile/${userData.dir}/${userData.type}`)
    },

    'click .download-pdf-analysis': function (e) {
        let userData = {
            dir: $(e.target).attr("dir"),
            type: "pdf"
        }
        window.open(`http://localhost:3001/analysis/getFile/${userData.dir}/${userData.type}`)
    },
})

Template.myAnalysis.helpers({
    myLists: function () {
        let userData = {
            userId: Session.get('id'),
        }
        $.ajax({
            url: 'http://localhost:3001/analysis/getAnalysisList',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function (data) {
                data.forEach(element => {
                    let item = `
                    <tr class="analysis-item" id="${element._id}">
                        <td>${element.title}</td>
                        <td>${element.date.substring(0,10)}</td>
                        <td><button alt=""  dir="${element.dir}" class="download-csv-analysis"></button></td>
                        <td><button alt=""  dir="${element.dir}" class="download-pdf-analysis"></button></td>
                        <td><button alt=""  dir="${element.dir}" class="download-json-analysis"></button></td>
                        <td><button alt=""  id="${element._id}" class="view-analysis"></button></td>
                        <td><button alt=""  id="${element._id}" class="delete-analysis"></button></td>
                    </tr>
                    `
                    $(".analysis-items").append(item)
                });
            }
        })
    }
})


}
//
// if (Meteor.isClient) {
//     //회원가입
//     Template.register.events({
//         'click .register-btn': function(event) {
//             let check = $(".register-panel input[type=text]");
//             let check_all = true;
//             for(var i = 0; i < check.length; i++){
//                 if(check[i].value==""){
//                     $(check[i]).css("border","2px solid red");
//                     check_all = false;
//                 }
//                 else{
//                     $(check[i]).css("border","2px solid #bfbfbf");
//                 }
//             }
//             check = $(".register-panel input[type=password]");
//             for(var i = 0; i < check.length; i++){
//                 if(check[i].value==""){
//                     $(check[i]).css("border","2px solid red");
//                     check_all = false;
//                 }
//                 else{
//                     $(check[i]).css("border","2px solid #bfbfbf");
//                 }
//             }
//             check = $(".register-panel input[name=hp-ad]:checked");
//             if(check.val()==undefined){
//                 $(check).css("border","2px solid red");
//                 check_all = false;
//             }
//             else{
//                 $(check[i]).css("border","2px solid #bfbfbf");
//             }
//             check = $(".register-panel input[name=gender]:checked");
//             if(check.val()==undefined){
//                 $(check).css("border","2px solid red");
//                 check_all = false;
//             }
//             else{
//                 $(check[i]).css("border","2px solid #bfbfbf");
//             }
//             if(check_all == false){
//                 Bert.alert( "필수 입력 항목을 모두 채워주세요.", 'danger', 'growl-top-right', 'fa-frown-o' );
//                 return;
//             }
//             event.preventDefault();
//             var emailVar = $('[name=registerEmail]').val();
//             var passwordVar = $('[name=registerPassword]').val();
//             var passwordVaR = $('[name=registerPasswordRepeat]').val();
//             var bdate = $('[name=birth]').val().split("/");
//             if(!emailVar.includes("@")){
//                 $('[name=registerEmail]').css("border","2px solid red");
//                 Bert.alert( "아이디를 이메일 형식으로 입력해주세요.", 'danger', 'growl-top-right', 'fa-frown-o' );
//                 return;
//             }
//             if(passwordVar.length>15 || passwordVar.length<8){
//                 $('[name=registerPassword]').css("border","2px solid red");
//                 Bert.alert( "비밀번호는 8~15자리 이내여야 합니다..", 'danger', 'growl-top-right', 'fa-frown-o' );
//                 return;
//             }
//             else{
//                 $('[name=registerEmail]').css("border","2px solid #bfbfbf");
//             }
//             if(passwordVar==passwordVaR){
//                 Accounts.createUser({
//                     email: emailVar,
//                     password: passwordVar,
//                     username : $('[name=name]').val(),
//                     gender : $('[name=gender]:checked').val(),
//                     birth : bdate[2]+bdate[0]+bdate[1],
//                     phone : $(".findID-hp-1").val()+$(".findID-hp-2").val()+$(".findID-hp-3").val(),
//                     phoneAd : $('[name=hp-ad]:checked').val(),
//                     interest1 : $('[name=interest-1]').val(),
//                     interest2 : $('[name=interest-2]').val()
//                 },function(err){
//                     if(err){
//                         Bert.alert( err.reason, 'danger', 'growl-top-right', 'fa-frown-o' );
//                     }
//                     else{
//                         Bert.alert( '회원가입이 성공적으로 완료되었습니다.', 'success', 'growl-top-right', 'fa-smile-o' );
//                         FlowRouter.go('/');
//                     }
//                 });
//             }
//             else{
//                 Bert.alert( "비밀번호와 비밀번호 확인이 다릅니다.", 'danger', 'growl-top-right', 'fa-frown-o' );
//             }
//         }
//     });
//
//     Template.register.onRendered(function(){
//         $('#sandbox-container').datepicker({
//             startView: 2,
//             language: "kr",
//             autoclose: true
//         });
//     });
//
//     //로그인
//     Template.login.events({
//         'submit form': function(event) {
//             event.preventDefault();
//
//             let check = $("input[type=text]");
//             let check_all = true;
//             for(var i = 0; i < check.length; i++){
//                 if(check[i].value==""){
//                     $(check[i]).css("border","2px solid red");
//                     check_all = false;
//                 }
//                 else{
//                     $(check[i]).css("border","2px solid #bfbfbf");
//                 }
//             }
//             check = $("input[type=password]");
//             for(var i = 0; i < check.length; i++){
//                 if(check[i].value==""){
//                     $(check[i]).css("border","2px solid red");
//                     check_all = false;
//                 }
//                 else{
//                     $(check[i]).css("border","2px solid #bfbfbf");
//                 }
//             }
//             if(check_all == false){
//                 Bert.alert( "입력 항목을 모두 채워주세요.", 'danger', 'growl-top-right', 'fa-frown-o' );
//                 return;
//             }
//
//             var emailVar = $('[name=loginEmail]').val();
//             var passwordVar = $('[name=loginPassword]').val();
//             Meteor.loginWithPassword({email:emailVar}, passwordVar, function(err){
//                 if(err){
//                     Bert.alert( err.reason, 'danger', 'growl-top-right', 'fa-frown-o' );
//                 }
//                 else{
//                     Bert.alert( '환영합니다. '+emailVar+'님.', 'success', 'growl-top-right', 'fa-smile-o' );
//                     FlowRouter.go('/');
//                 }
//             });
//         },
//         'click .toRegister': function(event) {
//             event.preventDefault();
//             FlowRouter.go('/register');
//         },
//         'click .toFindIdPw': function(event) {
//             event.preventDefault();
//             FlowRouter.go('/findID');
//         }
//     });
//
//     //로그아웃
//     Template.mainTopBar.events({
//     'click .logout': function(event){
//             event.preventDefault();
//             Meteor.logout();
//             Bert.alert( '성공적으로 로그아웃되었습니다.', 'success', 'growl-top-right', 'fa-smile-o' );
//             FlowRouter.go('/');
//         },
//     'mouseenter .dropdown, .dropdown-content': function(event){
//             $(".dropdown-content").css("display", "block");
//             console.log(1);
//         },
//     'mouseleave .dropdown': function(event){
//             $(".dropdown-content").css("display", "none");
//             console.log(1);
//         }
//     });
//
//     Template.findID.events({
//     'click .findID-btn': function(event){
//             event.preventDefault();
//
//             let check = $("input[type=text]");
//             let check_all = true;
//             for(var i = 0; i < check.length; i++){
//                 if(check[i].value==""){
//                     $(check[i]).css("border","2px solid red");
//                     check_all = false;
//                 }
//                 else{
//                     $(check[i]).css("border","2px solid #bfbfbf");
//                 }
//             }
//             if(check_all == false){
//                 Bert.alert( "입력 항목을 모두 채워주세요.", 'danger', 'growl-top-right', 'fa-frown-o' );
//                 return;
//             }
//
//             if($(".findID-name").val()==""){
//                 Bert.alert( "이름을 입력해주세요.", 'danger', 'growl-top-right', 'fa-frown-o' );
//             }
//             else{
//                 var bdate = $(".findID-birth").val().split("/");
//                 Meteor.call('findIdFunction',$(".findID-name").val(),(bdate[2]+bdate[0]+bdate[1]), $(".findID-hp-1").val()+$(".findID-hp-2").val()+$(".findID-hp-3").val(), function(err, response) {
//                     if (response == "null") {
//                         Bert.alert( "입력하신 정보와 일치하는 학습자를 찾을 수 없습니다.", 'danger', 'growl-top-right', 'fa-frown-o' );
//                     } else{
//                         $(".findID-modal-desc").text("해당 개인정보로 가입된 아이디는 "+response+" 입니다.");
//                         $(".findID-modal").show();
//                     }
//                 });
//             }
//         },
//     'click .findID-modal-submit': function(event){
//             event.preventDefault();
//             location.reload();
//         },
//     'click .findID-modal-close': function(event){
//             event.preventDefault();
//             location.reload();
//         }
//     });
//
//     Template.findID.onRendered(function(){
//         $('#sandbox-container').datepicker({
//             startView: 2,
//             language: "kr",
//             autoclose: true
//         });
//     });
//
//     Template.findPW.events({
//     'click .findPW-btn': function(event){
//             event.preventDefault();
//             let check = $("input[type=text]");
//             let check_all = true;
//             for(var i = 0; i < check.length; i++){
//                 if(check[i].value==""){
//                     $(check[i]).css("border","2px solid red");
//                     check_all = false;
//                 }
//                 else{
//                     $(check[i]).css("border","2px solid #bfbfbf");
//                 }
//             }
//             if(check_all == false){
//                 Bert.alert( "입력 항목을 모두 채워주세요.", 'danger', 'growl-top-right', 'fa-frown-o' );
//                 return;
//             }
//
//             if($(".findPW-id").val()==""){
//                 Bert.alert( "아이디를 입력해주세요.", 'danger', 'growl-top-right', 'fa-frown-o' );
//             }
//             else{
//                 var bdate = $(".findID-birth").val().split("/");
//                 Meteor.call('findPwFunction',$(".findPW-id").val(), $(".findPW-username").val(), (bdate[2]+bdate[0]+bdate[1]), "none", function(err, response) {
//                     if (response == false) {
//                         Bert.alert( "입력하신 정보와 일치하는 학습자를 찾을 수 없습니다.", 'danger', 'growl-top-right', 'fa-frown-o' );
//                     } else{
//                         $(".findID-modal").show();
//                     }
//                 });
//             }
//         },
//     'click .findID-modal-submit': function(event){
//             event.preventDefault();
//             let check = $(".mofidyPW-pwd");
//             let check_all = true;
//             for(var i = 0; i < check.length; i++){
//                 if(check[i].value==""){
//                     $(check[i]).css("border","2px solid red");
//                     check_all = false;
//                 }
//                 else{
//                     $(check[i]).css("border","2px solid #bfbfbf");
//                 }
//             }
//             if(check_all == false){
//                 Bert.alert( "입력 항목을 모두 채워주세요.", 'danger', 'growl-top-right', 'fa-frown-o' );
//                 return;
//             }
//             else if(!($(".new-pw-1").val() == $(".new-pw-2").val())){
//                 Bert.alert( "새 비밀번호와 새 비밀번호 확인이 같지 않습니다.", 'danger', 'growl-top-right', 'fa-frown-o' );
//             }
//             else if($(".new-pw-1").val().length>15 || $(".new-pw-1").val().length<8){
//                 $('[name=registerPassword]').css("border","2px solid red");
//                 Bert.alert( "비밀번호는 8~15자리 이내여야 합니다..", 'danger', 'growl-top-right', 'fa-frown-o' );
//                 return;
//             }
//             else{
//                 var bdate = $(".findID-birth").val().split("/");
//                 Meteor.call('findPwFunction',$(".findPW-id").val(), $(".findPW-username").val(), (bdate[2]+bdate[0]+bdate[1]), $(".new-pw-1").val(), function(err, response) {
//                     Bert.alert( "비밀번호 변경 성공", 'success', 'growl-top-right', 'fa-smile-o' );
//                     FlowRouter.go("/login");
//                 });
//             }
//         },
//     'click .findID-modal-close': function(event){
//             event.preventDefault();
//             $(".findID-modal").hide();
//         }
//     });
//
//     Template.findPW.onRendered(function(){
//         $('#sandbox-container').datepicker({
//             startView: 2,
//             language: "kr",
//             autoclose: true
//         });
//     });
//
//     Template.modifyPW.events({
//     'click .mofidyPW-btn-1': function(event){
//             event.preventDefault();
//
//             let check = $("input[type=password]");
//             let check_all = true;
//             for(var i = 0; i < check.length; i++){
//                 if(check[i].value==""){
//                     $(check[i]).css("border","2px solid red");
//                     check_all = false;
//                 }
//                 else{
//                     $(check[i]).css("border","2px solid #bfbfbf");
//                 }
//             }
//             if(check_all == false){
//                 Bert.alert( "입력 항목을 모두 채워주세요.", 'danger', 'growl-top-right', 'fa-frown-o' );
//                 return;
//             }
//
//             if($(".cur-pw").val()==""){
//                 Bert.alert( "현재 비밀번호를 입력해주세요.", 'danger', 'growl-top-right', 'fa-frown-o' );
//             }
//             else if(!($(".new-pw-1").val() == $(".new-pw-2").val())){
//                 Bert.alert( "새 비밀번호와 새 비밀번호 확인이 같지 않습니다.", 'danger', 'growl-top-right', 'fa-frown-o' );
//             }
//             else{
//                 Accounts.changePassword($(".cur-pw").val(), $(".new-pw-1").val(), function(err){
//                     if(err) Bert.alert( err.reason, 'danger', 'growl-top-right', 'fa-frown-o' );
//                     else Bert.alert( "비밀번호 변경 성공", 'success', 'growl-top-right', 'fa-smile-o' );
//                 });
//             }
//         }
//     });
//
//     Template.modifyMyInfo.events({
//     'click .modifyMyInfo-btn': function(event){
//             event.preventDefault();
//
//             let check = $("input[type=password]");
//             let check_all = true;
//             for(var i = 0; i < check.length; i++){
//                 if(check[i].value==""){
//                     $(check[i]).css("border","2px solid red");
//                     check_all = false;
//                 }
//                 else{
//                     $(check[i]).css("border","2px solid #bfbfbf");
//                 }
//             }
//             if(check_all == false){
//                 Bert.alert( "현재 비밀번호를 입력해주세요.", 'danger', 'growl-top-right', 'fa-frown-o' );
//                 return;
//             }
//
//             if($(".modifyMyInfo-pwd").val()==""){
//                 Bert.alert( "현재 비밀번호를 입력해주세요.", 'danger', 'growl-top-right', 'fa-frown-o' );
//             }
//             else{
//                 Accounts.changePassword($(".modifyMyInfo-pwd").val(), $(".modifyMyInfo-pwd").val(), function(err){
//                     if(err) Bert.alert( err.reason, 'danger', 'growl-top-right', 'fa-frown-o' );
//                     else FlowRouter.go('/modifyMyInfoDetail');
//                 })
//             }
//         }
//     });
//
//     Template.modifyMyInfoDetail.events({
//     'click .register-btn': function(event){
//             event.preventDefault();
//
//             let check = $(".register-panel input[type=text]");
//             let check_all = true;
//             for(var i = 0; i < check.length; i++){
//                 if(check[i].value==""){
//                     $(check[i]).css("border","2px solid red");
//                     check_all = false;
//                 }
//                 else{
//                     $(check[i]).css("border","2px solid #bfbfbf");
//                 }
//             }
//             check = $(".register-panel input[type=password]");
//             for(var i = 0; i < check.length; i++){
//                 if(check[i].value==""){
//                     $(check[i]).css("border","2px solid red");
//                     check_all = false;
//                 }
//                 else{
//                     $(check[i]).css("border","2px solid #bfbfbf");
//                 }
//             }
//             check = $(".modifyMyInfoDetail-hp-ad:checked");
//             if(check.val()==undefined){
//                 $(check).css("border","2px solid red");
//                 check_all = false;
//             }
//             else{
//                 $(check[i]).css("border","2px solid #bfbfbf");
//             }
//             check = $(".modifyMyInfoDetail-gender:checked");
//             if(check.val()==undefined){
//                 $(check).css("border","2px solid red");
//                 check_all = false;
//             }
//             else{
//                 $(check[i]).css("border","2px solid #bfbfbf");
//             }
//             if(check_all == false){
//                 Bert.alert( "필수 입력 항목을 모두 채워주세요.", 'danger', 'growl-top-right', 'fa-frown-o' );
//                 return;
//             }
//
//
//             var bdate = $(".modifyMyInfoDetail-birth").val().split("/");
//             Meteor.call('updateMyInfoFunction', Meteor.users.find({}).fetch()[0]["_id"], $(".modifyMyInfoDetail-username").val(), $(".modifyMyInfoDetail-gender:checked").val(), (bdate[2]+bdate[0]+bdate[1]),  $(".findID-hp-1").val()+$(".findID-hp-2").val()+$(".findID-hp-3").val(), $(".modifyMyInfoDetail-hp-ad:checked").val(), $(".interest-1").val(), $(".interest-2").val(), function(err, response) {
//                 Bert.alert( "개인정보 변경 성공", 'success', 'growl-top-right', 'fa-smile-o' );
//             });
//         }
//     });
//
//     Template.modifyMyInfoDetail.onRendered(function(){
//         $('#sandbox-container').datepicker({
//             startView: 2,
//             language: "kr",
//             autoclose: true
//         });
//     });
// }
