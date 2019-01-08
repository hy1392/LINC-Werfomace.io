import { Meteor } from 'meteor/meteor';
import {Session} from 'meteor/session';
import Chart from 'chart.js';

if(Meteor.isClient){
    Template.registerHelper('check_session', function(){
        return Session.get('status')
    })
    Template.modifyMyInfo.onRendered( function() {
        fetch("http://localhost:3001/account/jwt", {
                method: 'post',
                mode: 'cors',
                headers: {
                    'x-access-token': localStorage.token
                }
            }).then(result => result.json())
            .then(function (tokenData) {
                let currentUser = {
                    id : tokenData.id
                }
                $.ajax({
                    url: 'http://localhost:3001/account/getUser',
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify(currentUser),
                    success: function (data) {
                        console.log(data)
                        Session.set({
                            id: data.id,
                            name: data.name,
                            birth: data.birth,
                            gender: data.gender,
                            email: data.email,
                            tier: data.tier
                        })
                    }
                })
            })
    })
    Template.modifyMyInfo.helpers({
        get_id(){return Session.get('id')},
        get_name() {
                return Session.get('name')},
        get_email() {
                return Session.get('email')},
        get_gender() {
                return Session.get('gender')},
        get_birth() {
                return Session.get('birth')},
        get_tier: function () {
            if (Session.get('tier')=='free') return "무료"
            else return "유료"
        },
        check_gender_male(){
            if("male"==Session.get('gender')) return "checked"
        },
        check_gender_female() {
            if ("female" == Session.get('gender')) return "checked"
        }
    })

    Template.modifyMyInfo.events({
        'click .m_btn': function (event) {
            event.preventDefault();
            if ($("#m_user_pass").val() == "") {
                alert("비밀번호를 입력해 주세요.")
                return
            }
            if ($("#m_user_pass").val() === $("#m_user_pass_check").val()) {
                let userData = {
                    id: $("#m_user_id").val(),
                    pw: $("#m_user_pass").val(),
                    name: $("#m_user_name").val(),
                    birth: $("#m_user_birthDay").val(),
                    gender: $("#rg_user_gender").val(),
                    email: $("#m_user_email").val(),
                }
                console.log(userData);
                $.ajax({
                    url: 'http://localhost:3001/account/update',
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify(userData),
                    success: function (data) {
                        console.log(data)
                        if(data.code == "success"){
                            localStorage.token = data.token
                            alert("개인정보 수정이 완료되었습니다.")
                            FlowRouter.go("/")
                        }
                        else{
                            alert("비밀번호가 틀렸습니다.")
                        }
                    }
                })
            } else {
                alert("비밀번호와 비밀번호 확인이 같지 않습니다.");
            }
        },
    })

  

    Template.register.events({
    'click .rg-btn': function(event) {
        let startTile = new Date()
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
                    let endTime = new Date()
                    console.log(`${endTime-startTile} ms`)
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
            localStorage.token="";
            Session.set("status", null)
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
                    localStorage.token = data.token
                    localStorage.status = "login"
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
        fetch("http://localhost:3001/account/jwt", {
                method: 'post',
                mode: 'cors',
                headers: {
                    'x-access-token': localStorage.token
                }
            }).then(result => result.json())
            .then(function (tokenData) {
                if (tokenData.success == false) {
                    alert('로그인 후 이용해 주세요.')
                    FlowRouter.go("/login")
                    return
                }

                let userData = {
                    userId: tokenData.id,
                    url: $(".search-url").val(),
                }
                console.log(userData);
                $(".loader-container").show()
                $.ajax({
                    url: 'http://localhost:3001/analysis',
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify(userData),
                    success: function (data) {
                        alert("웹페이지 분석이 시작되었습니다. 나의 분석 결과 페이지로 이동하여 결과를 확인하세요")
                        $(".loader-container").hide()
                    }
                })
            })
    },
});

Template.analysisDetail.rendered = function(){
    let userData = {
        _id: FlowRouter.current().params.dataId
    }
    console.log(userData)
    $(".analysis-tab-3").html(`<iframe src="http://localhost:3001/analysis/getAnalysis/${userData._id}" frameborder="0" width="100%" height="2500px"></iframe>`)
    $.ajax({
        url: 'http://localhost:3001/analysis/getHistory',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(userData),
        success: function (data) {
            console.log(data)
            let graphData = [];
            let graphColor = [];
            let graphBorderColor = [];
            let grade
            data[0].score.split("-").forEach(element => {
                graphData.push(element*100)
            });
            let graphSum = graphData.reduce((a, b) => a + b)
            if (graphSum > 450) grade = "A"
            else if (graphSum > 400) grade = "B"
            else if (graphSum > 350) grade = "C"
            else if (graphSum > 300) grade = "D"
            else if (graphSum > 250) grade = "E"
            else grade = "F"
            $(".overall-grade").html(grade)
            if(data.length>1){
                let prevData = []
                data[1].score.split("-").forEach(element => {
                    prevData.push(element * 100)
                });
                let prevSum = prevData.reduce((a, b) => a + b)
                if (graphSum - prevSum >= 0) $(".overall-score").html(`${graphSum}/500<span style='color:green'>(+${graphSum - prevSum})</span>`)
                else $(".overall-score").html(`${graphSum}/500<span style='color:red'>(${graphSum - prevSum})</span>`)
            }
            else{
                $(".overall-score").html(`${graphSum}/500`)
            }
            graphData.forEach(element => {
                let color
                if(element>=90) color = 'rgba(23,130,57,'
                else if(element >= 50) color = 'rgba(230,119,0,'
                else color = 'rgba(199,34,31,'
                graphBorderColor.push(color+'1)')
                graphColor.push(color+'0.3)')
            })
            new Chart($(".overall"),{
                type:'bar',
                data: {
                    labels: [
                        'performance',
                        'pwa',
                        'accessbility',
                        'best-practices',
                        'seo'
                    ],
                    datasets: [{
                        label: 'Score',
                        data: graphData,
                        backgroundColor: graphColor,
                        borderColor: graphBorderColor,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                steps: 20,
                                stepValue: 5,
                                max: 100
                            }
                        }]
                    },
                    legend:{
                        display:false
                    }
                },
            })

            let graphLength = data.length
            let reversedData = data.reverse()
            let graphTitle = ['performance', 'pwa', 'accessbility', 'best-practices', 'seo']
            let labesArr = [], dirArr = [], performanceScore = [], pwaScore = [], accessbilityScore = [], bestScore = [], seoScore = []
            reversedData.forEach(element => {
                let scores = element.score.split("-")
                performanceScore.push(scores[0]*100)
                pwaScore.push(scores[1] * 100)
                accessbilityScore.push(scores[2] * 100)
                bestScore.push(scores[3] * 100)
                seoScore.push(scores[4] * 100)
                labesArr.push(element.date)
                dirArr.push(element.dir)
            })
            graphTitle.forEach(element => {
                let canvasTitle = `.overall-${element}`
                let canvas = $(canvasTitle)
                let data
                switch(element){
                    case 'performance': data = performanceScore; break;
                    case 'pwa': data = pwaScore; break;
                    case 'accessbility': data = accessbilityScore; break;
                    case 'best-practices': data = bestScore; break;
                    case 'seo': data = seoScore; break;
                }
                new Chart(canvas, {
                type:'line',
                data: {
                    labels: labesArr,
                    datasets: [{
                        label: 'Score',
                        data: data,
                        fill:false,
                        borderColor: 'rgba(54,162,235,0.5)',
                        backgroundColor: 'rgba(54,162,235,0.7)',
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                steps: 20,
                                stepValue: 5,
                                max: 100
                            }
                        }]
                    },
                    legend:{
                        display:false
                    },
                    'onClick' : (evt, item) => {
                        try {
                            FlowRouter.go(`/analysisDetail/${dirArr[item[0]._index]}`)
                        } catch (error) {
                            
                        }
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                },
            })
            })

            let startTime = new Date()
            $.ajax({
                url: 'http://localhost:3001/analysis/getDetail',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(userData),
                success: function (data) {
                    console.log(data)
                    data.forEach(element => {
                        let target
                        switch(element.category){
                            case "Performance": target = '.performance-list'; break;
                            case "Progressive Web App": target = '.pwa-list'; break;
                            case "Accessibility": target = '.accessbility-list'; break;
                            case "Best Practices": target = '.best-practices-list'; break;
                            case "SEO": target = '.seo-list'; break;
                        }
                        let shape, color, graphColor
                        if(element.type == "numeric"){
                            if (element.score * 100 >= 90) color = 'rgba(23,130,57,0.3)'
                            else if (element.score * 100 >= 50) color = 'rgba(230,119,0,0.3)'
                            else color = 'rgba(199,34,31,0.3)'
                            if (element.score * 100 >= 90) graphColor = 'rgba(23,130,57,1)'
                            else if (element.score * 100 >= 50) graphColor = 'rgba(230,119,0,1)'
                            else graphColor = 'rgba(199,34,31,1)'
                            shape = `<div class="list-item" style="background:${color}">
                                <p class="analysisDetail-list-title">${element.name}</p>
                                <button class="analysisDetail-btn" type="button" data-toggle="collapse" data-target="#${element.name}" aria-expanded="false"
                                    aria-controls="collapseExample">
                                    V
                                </button>
                                <div class="progress analysisDetail-progress">
                                    <div class="progress-bar" role="progressbar" style="width: ${element.score*100}%; background:${graphColor}" aria-valuenow="${element.score*100}" aria-valuemin="0" aria-valuemax="100">${parseInt(element.score*100)}</div>
                                </div>
                                </div>
                                <div class="collapse" id="${element.name}">
                                <p class="collapse-desc" id="${element.name}-desc"></p>
                            </div>`
                            $(target).append(shape)
                            let desc = `#${element.name}-desc`
                            $(desc).html(element.title)
                        }
                        else{
                            if (element.score == 1) color = 'rgba(23,130,57,0.3)'
                            else color = 'rgba(199,34,31,0.3)'
                            shape = `<div class="list-item" style="background:${color}">
                                <p class="analysisDetail-list-title">${element.name}</p>
                                <button class="analysisDetail-btn" type="button" data-toggle="collapse" data-target="#${element.name}" aria-expanded="false"
                                    aria-controls="collapseExample">
                                    V
                                </button>
                                </div>
                               <div class="collapse" id="${element.name}">
                                <p class="collapse-desc" id="${element.name}-desc"></p>
                            </div>`
                            $(target).append(shape)
                            let desc = `#${element.name}-desc`
                            let desc_text = element.title
                            $(desc).text(desc_text.replace(/`/gi, '"'))
                        }
                    });
                    let endTime = new Date()
                    console.log(`${endTime-startTime} ms`)
                }
            })

            // fetch("http://localhost:3001/account/jwt", {
            //     method: 'post',
            //     mode: 'cors',
            //     headers: {
            //         'x-access-token': localStorage.token
            //     }
            // }).then(result => result.json())
            // .then(function (tokenData) {
            //     console.log(tokenData)
            //     if (tokenData.tier == "free") {
            //         let tabs = $(".analysisDetail-tabs").toArray()
            //         tabs.forEach(element => {
            //             $(element).css("display", "none")
            //         });
            //         $(".analysis-tab-2").html("")
            //         $(".analysis-tab-3").html("")
            //     }
            // })
        }
    })
}

Template.analysisDetail.events({
    'click .analysisDetail-tabs' : (evt) => {
        let target = `.analysis-tab-${$(evt.target).attr('index')}`
        $(".analysisDetail-tabs-active").removeClass("analysisDetail-tabs-active")
        $(evt.target).addClass("analysisDetail-tabs-active")
        $(".analysis-tabs").css("display", "none")
        $(target).css("display", "block")
    }
})

Template.myInfo.events({
    'click .c-p-btn': function (event) {
        fetch("http://localhost:3001/account/jwt", {
            method:'post',
            mode: 'cors',
            headers: {
                'x-access-token': localStorage.token
            }
        }).then(result => result.json())
        .then(function (tokenData) {
            let userData = {
                // id: Session.get('id'),
                id: tokenData.id,
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
                    if (data == tokenData.id) {
                        FlowRouter.go("/modifyMyInfo");
                    } else if (data == "not found") {
                        alert("비밀번호가 틀렸습니다.")
                    }
                }
            })
        })
        .catch(() => {
            alert('로그인 정보가 잘못되었습니다. 다시 로그인 해주세요.')
            FlowRouter.go("/")
        })
    },
});

Template.myAnalysis.events({
    'click .delete-analysis': function(e){
        fetch("http://localhost:3001/account/jwt", {
                method: 'post',
                mode: 'cors',
                headers: {
                    'x-access-token': localStorage.token
                }
        }).then(result => result.json())
        .then(function (tokenData) {

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
                        userId: tokenData.id,
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
                                <td>${element.title} - ${element.date}</td>
                                <td>${element.date.substring(0,9)}</td>
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
        fetch("http://localhost:3001/account/jwt", {
                method: 'post',
                mode: 'cors',
                headers: {
                    'x-access-token': localStorage.token
                }
        }).then(result => result.json())
        .then(function (tokenData) {

            let userData = {
                userId: tokenData.id,
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
                        <td>${element.title} - ${element.date}</td>
                        <td>${element.date.substring(0,9)}</td>
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
        })
    }
})


}
